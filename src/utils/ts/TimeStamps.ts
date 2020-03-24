import { TimeStamp } from './TimeStamp'

class TimeStamps {
	description: string

	index: number

	timeStamps: Array<TimeStamp>

	timer: number = 0

	currentTimeStamp?: TimeStamp

	totalms: number = 0

	constructor(description: string, index: number) {
		this.timeStamps = []

		this.description = description
		this.index = index
	}
}

export {
	TimeStamps, // eslint-disable-line
}