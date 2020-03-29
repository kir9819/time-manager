import { openDB, DBSchema } from 'idb'
import { TimeStamps } from 'Utils/ts/TimeStamps'
import { getDate } from 'Utils/index'

const DB_VERSION: number = 3

interface TimeStampsDB extends DBSchema {
	days: {
		key: string,
		value: {
			date: string
			timeStamps: Array<string>
		}
	}

	timeStamps: {
		key: string,
		value: TimeStamps
		indexes: {
			date: string
		}
	}
}

const dbRequest = openDB<TimeStampsDB>('timeStamps', DB_VERSION, {
	async upgrade(db, oldVersion, newVersion, transaction) {
		switch (oldVersion) {
		case 2: {
			const timeStampsNewObject = db.createObjectStore('timeStamps', { keyPath: 'id' })
			timeStampsNewObject.createIndex('date', 'date')

			const daysStore = transaction.objectStore('days')
			const timeStampsStore = transaction.objectStore('timeStamps')

			const days = await daysStore.getAll()

			days.forEach(day => {
				const timeStamps = [] as Array<string>

				day.timeStamps.forEach((ts: unknown) => {
					(ts as TimeStamps).date = day.date

					timeStampsStore.put(ts as TimeStamps)
					timeStamps.push((ts as TimeStamps).id)
				})

				day.timeStamps = timeStamps

				daysStore.put(day)
			})

			await transaction.done

			break
		}
		case 1: default: {
			if (!db.objectStoreNames.contains('days')) {
				db.createObjectStore('days', { keyPath: 'date' })
			} else {
				db.deleteObjectStore('days')
				db.createObjectStore('days', { keyPath: 'date' })
			}
		}
		}
	},
})

class DB {
	static async getCurrentDayTimeStamps(): Promise<Array<TimeStamps>> {
		const request = await dbRequest
		const date = getDate()
		const day = await request.get('days', date)

		let timeStamps = [] as Array<TimeStamps>

		if (day) {
			const allTimeStamps = await Promise.all(day.timeStamps.map(timeStampId => request.get('timeStamps', timeStampId)))
			timeStamps = allTimeStamps.filter(ts => !!ts) as Array<TimeStamps>
		}

		return timeStamps
	}

	static async addTimeStamps(timeStamps: Array<TimeStamps>): Promise<void> {
		const request = await dbRequest

		const date = getDate()
		const ids = timeStamps.map(ts => ts.id)

		timeStamps.forEach(ts => {
			request.put('timeStamps', ts)
		})

		request.put('days', { date, timeStamps: ids })
	}

	static async getAllDays(): Promise<Array<string>> {
		const request = await dbRequest
		const dates = await request.getAll('days')

		return dates.map(date => date.date)
	}

	static async getTimeStampsByDate(date: string): Promise<Array<TimeStamps>> {
		const request = await dbRequest

		const timeStamps = await request.getAllFromIndex('timeStamps', 'date', date)

		return timeStamps.sort((ts1, ts2) => ts1.index - ts2.index)
	}
}

export default DB