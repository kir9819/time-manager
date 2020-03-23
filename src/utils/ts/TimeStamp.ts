interface ITimeStamp {
	start: Date
	end: Date
	description: string
	index: number
}

class TimeStamp implements ITimeStamp {
	start: Date

	end: Date

	description: string

	index: number

	constructor(description: string, index: number) {
		this.start = new Date()
		this.end = new Date()

		this.description = description
		this.index = index
	}
}

export {
	ITimeStamp,
	TimeStamp,
}