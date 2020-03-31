<template>
	<div class="time-stamp">
		<div
			class="time-stamp-body layout"
			:class="{ active: isRunning }"
			@click="select(item)"
			@contextmenu.prevent="showInput"
			@touchstart="start"
			@touchend="end"
			@touchmove="end"
		>
			<span class="time-stamp-index">{{ index }}</span>
			<div class="time-stamp-description">{{ item.description }}</div>
			<div class="time-stamp-time">{{ totalTime | totalTimeString }}</div>
		</div>

		<div
			v-if="isContextMenuVisible"
			class="context-menu"
		>
			<div
				class="context-menu-layout"
				@click="isContextMenuVisible = false"
				@contextmenu.prevent
			/>

			<div class="context-menu-body layout" @click.stop>
				<div class="context-menu-label">Изменить описание</div>
				<input
					ref="input"
					:value="item.description"
					placeholder="описание"
					@change="changeDescription({ description: $event.target.value, index: index })"
				>
				<div class="context-menu-actions">
					<div class="action-button" @click="isContextMenuVisible = false">Сохранить</div>
					<div class="action-button" @click="clearTimeStamps(index)">Очистить ячейку</div>
					<div
						v-if="index > DEFAULT_TIME_STAMPS_AMOUNT"
						class="action-button"
						@click="deleteTimeStamps(index)"
					>Удалить</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RootMapper, DEFAULT_TIME_STAMPS_AMOUNT } from 'Plugins/store/modules/root'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line
import { totalTimeString } from 'Utils/index'

const Mappers = Vue.extend({
	methods: {
		...RootMapper.mapActions(['select', 'changeDescription', 'clearTimeStamps', 'deleteTimeStamps']),
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

	isContextMenuVisible: boolean = false

	DEFAULT_TIME_STAMPS_AMOUNT: number = DEFAULT_TIME_STAMPS_AMOUNT

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

	get index(): number {
		return this.item.index
	}

	start(): void {
		this.timer = setTimeout(() => {
			window.navigator.vibrate(10)
			clearTimeout(this.timer)

			this.showInput()
		}, 500)
	}

	end(): void {
		clearTimeout(this.timer)
	}

	showInput() {
		this.isContextMenuVisible = true
		this.$nextTick(() => (this.$refs.input as HTMLInputElement).focus())
	}
}
</script>