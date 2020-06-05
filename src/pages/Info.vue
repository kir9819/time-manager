<template>
	<div id="page-info">
		<div ref="dates" class="dates-layout">
			<div
				v-for="date in dateList"
				:key="date"
				:ref="date"
				class="date-body layout"
				:class="{ active: date === currentDate }"
				@click="changeDate(date)"
			>{{ date | dateLocale }}</div>
		</div>

		<div class="time-stamps-layout layout-container">
			<div
				v-for="timeStamps in existingTimeStampsListLocal"
				:key="timeStamps.id"
				class="time-stamps-body layout"
			>
				<div>Индекс: {{ timeStamps.index }}</div>
				<div>Описание: {{ timeStamps.description || '-' }}</div>
				<div>Время: {{ timeStamps | totalTimeStringWithCurrent }}</div>
			</div>
		</div>

		<div class="total-time-layout layout-container">
			<div class="total-time-body layout">Общее время: {{ totalTimeLocal | totalTimeString }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/info'
import { RootMapper as RootModuleMapper } from 'Plugins/store/modules/root'
import { totalTimeString } from 'Utils/index'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line
import ScrollTo from 'vue-scrollto'

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapState(['dateList', 'currentDate', 'usingRoot']),
		...RootMapper.mapGetters(['totalTime', 'existingTimeStampsList']),
		...RootModuleMapper.mapState(['timeStampList']),
		...RootModuleMapper.mapGetters({ totalTimeRoot: 'totalTime' }),
	},
	methods: {
		...RootMapper.mapActions(['changeDate']),
	},
})

@Component({
	name: 'InfoPage',
	filters: {
		totalTimeString,
		totalTimeStringWithCurrent(timeStamps: TimeStamps): string {
			let currentTimeStampTime = 0

			if (timeStamps.currentTimeStamp) {
				currentTimeStampTime = timeStamps.currentTimeStamp.end.getTime() - timeStamps.currentTimeStamp.start.getTime()
			}

			return totalTimeString((timeStamps.totalms + currentTimeStampTime) / 1000)
		},
		dateLocale(date: string): string {
			const dateObj = new Date(date)

			return dateObj.toLocaleDateString()
		},
	},
})
export default class InfoPage extends Mappers {
	get existingTimeStampsListLocal(): Array<TimeStamps> {
		return this.usingRoot ? this.timeStampList.filter(ts => ts.totalms || ts.currentTimeStamp || ts.description) : this.existingTimeStampsList
	}

	get totalTimeLocal(): number {
		return this.usingRoot ? this.totalTimeRoot : this.totalTime
	}

	@Watch('currentDate', { immediate: true })
	scrollDates(date: string, oldDate?: string) {
		this.$nextTick(() => {
			const dateRef = this.$refs[date] as Array<HTMLDivElement>
			const datesRef = this.$refs.dates as HTMLDivElement

			if (datesRef.scrollLeft > (dateRef[0].offsetLeft + dateRef[0].offsetWidth)) return

			ScrollTo.scrollTo(dateRef[0], oldDate ? 500 : 1, {
				container: datesRef,
				offset: -(window.innerWidth / 2 - dateRef[0].offsetWidth / 2),
				x: true,
				y: false,
			})
		})
	}
}
</script>

<style lang="scss">
#page-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-height: calc(100vh - 96px);

	.dates-layout {
		justify-self: center;
		flex-shrink: 0;
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		padding: 8px 12px;
		padding-top: 0;

		.date {
			&-body {
				margin: 0 4px;
				padding: 8px 12px;
				cursor: pointer;
				user-select: none;
				border-radius: 8px;
				font-size: 14px;
				display: inline-block;

				&.active {
					background-color: var(--color-primary);
				}
			}
		}
	}

	.time-stamps {
		&-layout {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			margin-top: 8px;
			padding-top: 8px;
			padding-bottom: 72px;
			overflow-y: auto;
		}

		&-body {
			max-width: 300px;
			width: 100%;
			border-radius: 12px;
			padding: 8px 16px;
			margin: 4px;
			line-height: 1.5;
			text-align: left;
		}
	}
}
</style>