function getDate(fullDate: Date = new Date()): string {
	const year = fullDate.getFullYear()
	const month = (fullDate.getMonth() + 1).toString().padStart(2, '0')
	const date = fullDate.getDate().toString().padStart(2, '0')

	return `${year}-${month}-${date}`
}

function totalTimeString(time: number) {
	let totalTime = time

	const days = Math.floor(totalTime / 86400)
	totalTime -= days * 86400

	const hours = Math.floor(totalTime / 3600)
	totalTime -= hours * 3600

	const min = Math.floor(totalTime / 60)
	totalTime -= min * 60

	const sec = Math.floor(totalTime)

	const daysString = days ? `${days} д. ` : ''
	const hoursString = `${hours.toString().padStart(2, '0')}`
	const minString = `:${min.toString().padStart(2, '0')}`
	const secString = `:${sec.toString().padStart(2, '0')}`

	return daysString + hoursString + minString + secString
}

export {
	getDate,
	totalTimeString,
}