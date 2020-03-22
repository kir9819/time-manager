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

	static lastIndex: number = 0

	constructor(description: string) {
		this.start = new Date()
		this.end = new Date()
		this.description = description

		TimeStamp.lastIndex += 1
		this.index = TimeStamp.lastIndex
	}
}

export {
	ITimeStamp,
	TimeStamp,
}