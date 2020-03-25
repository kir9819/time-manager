import { openDB, DBSchema } from 'idb'
import { TimeStamps } from 'Utils/ts/TimeStamps'
import { getDate } from 'Utils/index'

const DB_VERSION: number = 2

interface TimeStampsDB extends DBSchema {
	days: {
		key: string,
		value: {
			date: string
			timeStamps: Array<TimeStamps>
		}
	}
}

const dbRequest = openDB<TimeStampsDB>('timeStamps', DB_VERSION, {
	upgrade(db) {
		if (!db.objectStoreNames.contains('days')) {
			db.createObjectStore('days', { keyPath: 'date' })
		} else {
			db.deleteObjectStore('days')
			db.createObjectStore('days', { keyPath: 'date' })
		}
	},
})

class DB {
	static async getCurrentDayTimeStamps(): Promise<Array<TimeStamps>> {
		const day = await (await dbRequest).transaction('days').objectStore('days').get(getDate())

		if (day) return day.timeStamps

		return []
	}

	static async addTimeStamps(timeStamps: Array<TimeStamps>): Promise<void> {
		(await dbRequest).put('days', { date: getDate(), timeStamps })
	}
}

export default DB