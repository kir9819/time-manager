<template>
	<div class="time-stamp">
		<div
			class="time-stamp-body layout"
			:class="{ active: isRunning }"
			@click="select(item)"
			@contextmenu.prevent="showInput"
			@touchstart="start"
			@touchend="end"
		>
			<span class="time-stamp-index">{{ item.index }}</span>
			<div class="time-stamp-description">{{ item.description }}</div>
			<div class="time-stamp-time">{{ totalTime | totalTimeString }}</div>
		</div>

		<div
			v-if="needShowInput"
			class="change-description"
		>
			<div
				class="change-description-layout"
				@click="needShowInput = false"
				@contextmenu.prevent
			/>

			<div class="change-description-body layout" @click.stop>
				<div class="change-description-label">Изменить описание</div>
				<input
					ref="input"
					:value="item.description"
					@input="changeDescription({ description: $event.target.value, index: item.index })"
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line
import { totalTimeString } from 'Utils/index'

const Mappers = Vue.extend({
	methods: {
		...RootMapper.mapActions(['select', 'changeDescription']),
	},
})

@Component({
	name: 'TimeStampItem',
	filters: {
		totalTimeString,
	},
})
export default class TimeStampItem extends Mappers {
	timer: number = 0

	needShowInput: boolean = false

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

	start(): void {
		this.timer = setTimeout(() => {
			window.navigator.vibrate(10)
			clearTimeout(this.timer)

			this.showInput()
		}, 600)
	}

	end(): void {
		clearTimeout(this.timer)
	}

	showInput() {
		this.needShowInput = true
		this.$nextTick(() => (this.$refs.input as HTMLInputElement).focus())
	}
}
</script>