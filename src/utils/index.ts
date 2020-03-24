function getDate(fullDate: Date = new Date()): string {
	const year = fullDate.getUTCFullYear()
	const month = fullDate.getUTCMonth().toString().padStart(2, '0')
	const date = fullDate.getUTCDate().toString().padStart(2, '0')

	return `${year}-${month}-${date}`
}

export {
	getDate, // eslint-disable-line
}