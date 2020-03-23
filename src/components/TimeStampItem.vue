<template>
	<div class="time-stamp">
		<span class="time-stamp-index">{{ item.index }}</span>
		<div class="time-stamp-description">{{ item.description }}</div>
		<div class="time-stamp-time">Время: {{ totalTime }}</div>
		<div class="time-stamp-status">{{ isRunning ? '⏸️' : '▶️' }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line

@Component
export default class TimeStampItem extends Vue {
	@Prop(Object) private item!: TimeStamps

	get totalTime(): string {
		const totalSeconds = this.item.timeStamps.reduce((total, current) => {
			total += current.end.getTime() - current.start.getTime() // eslint-disable-line
			return total
		}, 0) / 1000

		return totalSeconds.toFixed(0).toLocaleString()
	}

	get isRunning(): boolean {
		return !!this.item.timer
	}
}
</script>