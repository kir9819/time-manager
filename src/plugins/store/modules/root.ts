/* eslint-disable max-classes-per-file */

import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { TimeStamps, createTimeStamps } from 'Utils/ts/TimeStamps'
import { TimeStamp } from 'Utils/ts/TimeStamp'
import DB from 'Plugins/db'
import InfoStore from './info'

const DEFAULT_TIME_STAMPS_AMOUNT: number = 9

class RootState {
	timeStampList: Array<TimeStamps> = []

	currrentTimeStampIndex: number = -1

	static INDEX: number = 0
}

class RootGetters extends Getters<RootState> {
	getTimeStampByIndex(index: number): TimeStamps | void {
		return this.state.timeStampList.find(ts => ts.index === index)
	}

	get currentTimeStamp(): TimeStamps | void {
		return this.getters.getTimeStampByIndex(this.state.currrentTimeStampIndex)
	}

	get totalTime(): number {
		return this.state.timeStampList.reduce((total, ts) => {
			let currentTimeStampTime = 0

			if (ts.currentTimeStamp) {
				currentTimeStampTime = ts.currentTimeStamp.end.getTime() - ts.currentTimeStamp.start.getTime()
			}

			return total + ts.totalms + currentTimeStampTime
		}, 0) / 1000
	}
}

class RootMutations extends Mutations<RootState> {
	createStore(timeStamps: Array<TimeStamps>) {
		this.state.timeStampList = timeStamps
		RootState.INDEX = timeStamps.length
	}

	add(description: string = ''): void {
		this.state.timeStampList.push(new TimeStamps(description, RootState.INDEX += 1))
	}

	select(index: number): void {
		this.state.currrentTimeStampIndex = index
	}

	changeDescription(payload: { description: string, index: number }): void {
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === payload.index)

		if (timeStampByIndex) timeStampByIndex.description = payload.description
	}

	setTimer(payload: { index: number, timer: number }): void {
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === payload.index)
		if (timeStampByIndex) timeStampByIndex.timer = payload.timer
	}

	addTimeStamp(payload: { description: string, index: number }) {
		const timeStamp = new TimeStamp(payload.description, payload.index)
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === payload.index)


		if (timeStampByIndex) {
			timeStampByIndex.totalms = timeStampByIndex.timeStamps.reduce((total, current) => total + current.end.getTime() - current.start.getTime(), 0)
			timeStampByIndex.currentTimeStamp = timeStamp
			timeStampByIndex.timeStamps.push(timeStamp)
		}
	}

	stopTimeStamp(index: number) {
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === index)

		if (timeStampByIndex) {
			const { currentTimeStamp } = timeStampByIndex

			if (currentTimeStamp) {
				currentTimeStamp.end = new Date()
			}
		}
	}

	clearInterval(index: number) {
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === index)

		if (timeStampByIndex) {
			clearInterval(timeStampByIndex.timer)
			timeStampByIndex.timer = 0
		}
	}

	saveDataInDB(): void {
		DB.addTimeStamps(this.state.timeStampList)
	}

	clearTimeStamps(index: number): void {
		const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === index)

		if (timeStampByIndex) {
			timeStampByIndex.timeStamps = []
			timeStampByIndex.totalms = 0
			timeStampByIndex.description = ''
			timeStampByIndex.currentTimeStamp = timeStampByIndex.timeStamps[0] // eslint-disable-line
		}
	}
}

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
	async $init(): Promise<void> {
		const timeStamps = await this.getDataFromDB()

		if (timeStamps.length > 0) {
			this.commit('createStore', timeStamps)

			const findRunning = timeStamps.find(ts => ts.timer)

			if (findRunning) {
				this.commit('select', findRunning.index)
				this.commit('stopTimeStamp', findRunning.index)
				this.dispatch('run', findRunning.index)
			} else {
				this.commit('select', timeStamps[0].index)
			}
		} else if (this.state.timeStampList.length === 0) {
			for (let i = 0; i < DEFAULT_TIME_STAMPS_AMOUNT; i += 1) {
				this.commit('add')
			}

			this.commit('select', 1)
		}
	}

	/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getDataFromDB"] }] */

	async getDataFromDB(): Promise<Array<TimeStamps>> {
		const timeStamps = await DB.getCurrentDayTimeStamps()
		return timeStamps
	}

	select(timeStamp: TimeStamps): void {
		if (this.state.currrentTimeStampIndex === timeStamp.index) {
			if (this.getters.currentTimeStamp && this.getters.currentTimeStamp.timer) this.dispatch('stop', this.state.currrentTimeStampIndex)
			else this.dispatch('run', this.state.currrentTimeStampIndex)
			return
		}

		this.dispatch('stop', this.state.currrentTimeStampIndex)
		this.commit('select', timeStamp.index)
		this.dispatch('run', timeStamp.index)
	}

	run(index: number): void {
		this.commit('addTimeStamp', { description: '', index })

		let i = 0

		this.commit('setTimer', {
			index,
			timer: setInterval(() => {
				const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === index)
				if (!timeStampByIndex || !timeStampByIndex.currentTimeStamp) this.commit('clearInterval', index)
				else this.commit('stopTimeStamp', index)

				i += 1
				if (i >= 5) {
					this.commit('saveDataInDB')
					i = 0
				}
			}, 1000),
		})

		this.commit('saveDataInDB')
	}

	stop(index: number): void {
		this.commit('clearInterval', index)
		this.commit('stopTimeStamp', index)
		this.commit('saveDataInDB')
	}


	clearTimeStamps(index: number): void {
		this.dispatch('stop', index)
		this.commit('clearTimeStamps', index)
		this.commit('saveDataInDB')
	}

	clearAllTimeStamps(): void {
		this.dispatch('stop', this.state.currrentTimeStampIndex)

		this.state.timeStampList.forEach(ts => {
			this.commit('clearTimeStamps', ts.index)
		})

		this.commit('saveDataInDB')
	}

	changeDescription(payload: { description: string, index?: number }): void {
		const { description, index } = payload

		this.commit('changeDescription', { description, index: index || this.state.currrentTimeStampIndex })
		this.commit('saveDataInDB')
	}
}

const module = new Module({
	state: RootState,
	getters: RootGetters,
	mutations: RootMutations,
	actions: RootActions,
	modules: {
		InfoStore,
	},
})

export default module

export const RootMapper = createMapper(module)