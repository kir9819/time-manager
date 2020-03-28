<template>
	<div>
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

		<div v-if="currentTimeStamp" style="margin-top: 40px; text-align: left; line-height: 1.5;">
			<div>Текущий: {{ currentTimeStamp.index }}</div>
			<div>
				<span>Описание: </span>
				<input :value="currentTimeStamp.description" @change="changeDescription({ description: $event.target.value })">
			</div>
			<div>
				<span>Время: </span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'
import TimeStampItem from './TimeStampItem.vue'

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapState(['timeStampList']),
		...RootMapper.mapGetters(['currentTimeStamp']),
	},
	methods: {
		...RootMapper.mapMutations(['add', 'changeDescription']),
	},
})

@Component({ name: 'TimeStamps', components: { TimeStampItem } })
export default class TimeStampsComponent extends Mappers {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hello {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.time-stamp {
	min-width: 110px;
	max-width: 33.33%;
	min-height: 110px;

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

		&.active {
			background-color: var(--color-primary);
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

	&-status {
		position: absolute;
		top: 4px;
		right: 4px;
		font-size: 20px;
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

h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: var(--color-active);
}
</style>