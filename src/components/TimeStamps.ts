import { TimeStamp } from './TimeStamp'

class TimeStamps {
	description: string

	index: number

	timeStamps: Array<TimeStamp>

	timer: number = 0

	currentTimeStamp?: TimeStamp

	constructor(description: string, index: number) {
		this.timeStamps = []

		this.description = description
		this.index = index
	}

	run(): void {
		this.currentTimeStamp = new TimeStamp(this.description, this.index)
		this.timeStamps.push(this.currentTimeStamp)

		this.timer = setInterval(() => {
			if (!this.currentTimeStamp) this.clearInterval()
			else {
				this.currentTimeStamp.end = new Date()
			}
		}, 1000)
	}

	stop(): void {
		this.clearInterval()

		if (this.currentTimeStamp) this.currentTimeStamp.end = new Date()
	}

	clearInterval(): void {
		clearInterval(this.timer)
		this.timer = 0
	}
}

export {
	TimeStamps, // eslint-disable-line
}