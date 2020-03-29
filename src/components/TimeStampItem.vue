<template>
	<div class="time-stamp">
		<div
			class="time-stamp-body layout"
			:class="{ active: currentTimeStamp === item }"
			@click="select(item)"
		>
			<span class="time-stamp-index">{{ item.index }}</span>
			<div class="time-stamp-description">{{ item.description }}</div>
			<div class="time-stamp-time">{{ totalTime | totalTimeString }}</div>
			<div class="time-stamp-status">{{ isRunning ? '⏸️' : '▶️' }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line
import { totalTimeString } from 'Utils/index'

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapGetters(['currentTimeStamp']),
	},
	methods: {
		...RootMapper.mapActions(['select']),
	},
})

@Component({
	name: 'TimeStampItem',
	filters: {
		totalTimeString,
	},
})
export default class TimeStampItem extends Mappers {
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

	get isRunning(): boolean {
		return !!this.item.timer
	}
}
</script>