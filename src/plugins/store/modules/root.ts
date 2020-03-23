/* eslint-disable max-classes-per-file */

import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { TimeStamps } from 'Utils/ts/TimeStamps'
import { TimeStamp } from 'Utils/ts/TimeStamp'

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
}


class RootMutations extends Mutations<RootState> {
	add(description: string = ''): void {
		this.state.timeStampList.push(new TimeStamps(description, RootState.INDEX += 1))
	}

	select(index: number): void {
		this.state.currrentTimeStampIndex = index
	}

	changeDescription(payload: { description: string, index?: number }): void {
		if (!payload.index) {
			const currrentTimeStamp = this.state.timeStampList.find(ts => ts.index === this.state.currrentTimeStampIndex)
			if (currrentTimeStamp) currrentTimeStamp.description = payload.description
			return
		}

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
}


class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
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
		this.commit('setTimer', {
			index,
			timer: setInterval(() => {
				const timeStampByIndex = this.state.timeStampList.find(ts => ts.index === index)
				if (!timeStampByIndex || !timeStampByIndex.currentTimeStamp) this.commit('clearInterval', index)
				else this.commit('stopTimeStamp', index)
			}, 1000),
		})
	}

	stop(index: number): void {
		this.commit('clearInterval', index)
		this.commit('stopTimeStamp', index)
	}
}

const module = new Module({
	state: RootState,
	getters: RootGetters,
	mutations: RootMutations,
	actions: RootActions,
})

export default module

export const RootMapper = createMapper(module)