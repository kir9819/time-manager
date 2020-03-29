/* eslint-disable max-classes-per-file */

import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { TimeStamps } from 'Utils/ts/TimeStamps'
import DB from 'Plugins/db'

class RootState {
	dateList: Array<string> = []

	currentDate: string = ''

	timeStampsList: Array<TimeStamps> = []
}

class RootGetters extends Getters<RootState> {
	get existingTimeStampsList(): Array<TimeStamps> {
		return this.state.timeStampsList.filter(ts => ts.totalms || ts.currentTimeStamp)
	}

	get totalTime(): number {
		return this.getters.existingTimeStampsList.reduce((total, ts) => {
			const currentTimeStampTime = ts.currentTimeStamp.end.getTime() - ts.currentTimeStamp.start.getTime()

			return total + ts.totalms + currentTimeStampTime
		}, 0) / 1000
	}
}

class RootMutations extends Mutations<RootState> {
	createStore(dateList: Array<string>) {
		this.state.dateList = dateList
	}

	setCurrentDate(date?: string) {
		if (!date) {
			const lastItemIndex = this.state.dateList.length > 0 ? this.state.dateList.length - 1 : 0
			this.state.currentDate = this.state.dateList[lastItemIndex]
		} else this.state.currentDate = date
	}

	setTimeStamps(timeStampsList: Array<TimeStamps>) {
		this.state.timeStampsList = timeStampsList
	}
}

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
	/* eslint class-methods-use-this: ["error", { "exceptMethods": ["$init", "changeDate"] }] */

	async $init(): Promise<void> {
		this.commit('createStore', await DB.getAllDays())
		this.dispatch('changeDate')
	}

	async changeDate(date?: string): Promise<void> {
		if (date === this.state.currentDate) return
		this.commit('setCurrentDate', date)
		this.commit('setTimeStamps', await DB.getTimeStampsByDate(this.state.currentDate))
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