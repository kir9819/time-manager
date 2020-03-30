<template>
	<div id="page-info" class="layout-container">
		<div class="dates-layout">
			<div
				v-for="date in dateList"
				:key="date"
				class="date-body layout"
				:class="{ active: date === currentDate }"
				@click="changeDate(date)"
			>{{ date | dateLocale }}</div>
		</div>

		<div class="time-stamps-layout">
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

		<div class="total-time layout">Общее время: {{ totalTimeLocal | totalTimeString }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/info'
import { RootMapper as RootModuleMapper } from 'Plugins/store/modules/root'
import { totalTimeString } from 'Utils/index'
import { TimeStamps } from 'Utils/ts/TimeStamps' // eslint-disable-line

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
		return this.usingRoot ? this.timeStampList.filter(ts => ts.totalms || ts.currentTimeStamp) : this.existingTimeStampsList
	}

	get totalTimeLocal(): number {
		return this.usingRoot ? this.totalTimeRoot : this.totalTime
	}
}
</script>

<style lang="scss">
#page-info {
	display: flex;
	flex-direction: column;
	align-items: center;

	.dates-layout {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.date {
			&-body {
				margin: 4px;
				padding: 8px 12px;
				cursor: pointer;
				border-radius: 8px;
				font-size: 14px;

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
			margin-top: 16px;
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

	.total-time {
		margin-top: 16px;
		padding: 12px;
		border-radius: 12px;
		max-width: 350px;
		width: 100%;
	}
}
</style>