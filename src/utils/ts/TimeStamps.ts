import { getDate } from 'Utils/index'
import { TimeStamp } from './TimeStamp'

class TimeStamps {
	id: string

	date: string

	description: string

	index: number

	timeStamps: Array<TimeStamp>

	timer: number = 0

	currentTimeStamp: TimeStamp

	totalms: number = 0

	constructor(description: string, index: number) {
		this.date = getDate()
		this.id = `${this.date}_${index}`
		this.timeStamps = []
		this.currentTimeStamp = this.timeStamps[0] // eslint-disable-line prefer-destructuring

		this.description = description
		this.index = index
	}
}

function createTimeStamps(json: string | null): TimeStamps | void {
	if (!json) return undefined

	try {
		return JSON.parse(json) as TimeStamps
	} catch (error) {
		return undefined
	}
}

export {
	TimeStamps,
	createTimeStamps,
}