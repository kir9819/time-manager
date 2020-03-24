<template>
	<div class="time-stamp">
		<span class="time-stamp-index">{{ item.index }}</span>
		<div class="time-stamp-description">{{ item.description }}</div>
		<div class="time-stamp-time">{{ totalTimeString }}</div>
		<div class="time-stamp-status">{{ isRunning ? '⏸️' : '▶️' }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line

@Component
export default class TimeStampItem extends Vue {
	@Prop(Object) private item!: TimeStamps

	get currentTimeStampTime(): number {
		if (this.item.currentTimeStamp) {
			return this.item.currentTimeStamp.end.getTime() - this.item.currentTimeStamp.start.getTime()
		}

		return 0
	}

	get totalTime(): number {
		return (this.item.totalms + this.currentTimeStampTime) / 1000
	}

	get totalTimeString(): string {
		let { totalTime } = this

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

	get isRunning(): boolean {
		return !!this.item.timer
	}
}
</script>