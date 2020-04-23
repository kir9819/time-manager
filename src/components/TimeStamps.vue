<template>
	<div id="time-stamps">
		<div class="hello">
			<TimeStampItem
				v-for="timeStamp in timeStampList"
				:key="timeStamp.index"
				:item="timeStamp"
			/>

			<div class="time-stamp" @click="add()">
				<div class="time-stamp-body add-one">
					<span class="add-one-label layout">+</span>
				</div>
			</div>
		</div>

		<div class="total-time-layout layout-container">
			<div class="total-time-body layout">Общее время: {{ totalTime | totalTimeString }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'
import { totalTimeString } from 'Utils/index'
import TimeStampItem from './TimeStampItem.vue'

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapState(['timeStampList']),
		...RootMapper.mapGetters(['currentTimeStamp', 'totalTime']),
	},
	methods: {
		...RootMapper.mapMutations(['add']),
		...RootMapper.mapActions(['changeDescription']),
	},
})

@Component({
	name: 'TimeStamps',
	components: { TimeStampItem },
	filters: { totalTimeString },
})
export default class TimeStampsComponent extends Mappers {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#time-stamps {
	padding-bottom: 72px;

	.hello {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.time-stamp {
		min-width: 110px;
		max-width: 33.33%;
		min-height: 110px;

		.context-menu {
			width: 100vw;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			z-index: 1000;
			user-select: none;

			&-body {
				position: relative;
				z-index: 2;
				padding: 24px;
				margin-top: 125px;
				border-radius: 12px;
				min-width: 250px;
			}

			&-label {
				margin-bottom: 12px;
			}

			&-layout {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0.8;
				background-color: black;
			}

			&-actions {
				margin-top: 16px;
				margin-left: -4px;
				margin-right: -4px;

				.action {
					&-button {
						padding: 4px 8px;
						margin: 4px;
						cursor: pointer;
						border-radius: 8px;
						border: 1px solid var(--root-color);
					}
				}
			}
		}

		&, &-body {
			padding: 4px;
			box-sizing: border-box;
			width: 100%;
		}

		&-body {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			position: relative;
			padding: 4px;
			cursor: pointer;
			user-select: none;
			border-radius: 8px;
			line-height: 1.5;
			height: 100%;
			border: 1px solid transparent;

			&.active {
				background-color: var(--color-primary);
			}

			&.exist {
				border-color: var(--color-active);
			}
		}

		&-index {
			font-size: 20px;
		}

		&-description {
			font-size: 12px;
			margin-top: 4px;
		}

		&-time {
			margin-top: 8px;
		}

		.time-stamp-body {
			&.add-one {
				justify-content: center;

				.add-one-label {
					width: 40px;
					height: 40px;
					line-height: 40px;
					border-radius: 100%;
					text-align: center;
					justify-self: center;
					align-self: center;
				}
			}
		}
	}
}
</style>