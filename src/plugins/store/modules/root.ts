/* eslint-disable max-classes-per-file */

import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { TimeStamps } from 'Utils/ts/TimeStamps'
import { TimeStamp } from 'Utils/ts/TimeStamp'

class RootState {
	timeStampList: Array<TimeStamps> = []

	currentTimeStamp?: TimeStamps

	static INDEX: number = 0
}

class RootMutations extends Mutations<RootState> {
	add(description: string = ''): void {
		this.state.timeStampList.push(new TimeStamps(description, RootState.INDEX += 1))
	}

	select(timeStamp: TimeStamps): void {
		this.state.currentTimeStamp = timeStamp
	}

	changeDescription(payload: { description: string, index?: number }): void {
		if (!payload.index) {
			if (this.state.currentTimeStamp) this.state.currentTimeStamp.description = payload.description
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


class RootActions extends Actions<RootState, Getters<RootState>, RootMutations, RootActions> {
	select(timeStamp: TimeStamps): void {
		if (this.state.currentTimeStamp === timeStamp) {
			if (this.state.currentTimeStamp.timer) this.dispatch('stop', timeStamp.index)
			else this.dispatch('run', timeStamp.index)
			return
		}

		if (this.state.currentTimeStamp) this.dispatch('stop', this.state.currentTimeStamp.index)
		this.state.currentTimeStamp = timeStamp
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
	mutations: RootMutations,
	actions: RootActions,
})

export default module

export const RootMapper = createMapper(module)