<template>
	<div>
		<div class="hello">
			<TimeStampItem
				v-for="timeStamp in timeStampList"
				:key="timeStamp.index"
				:class="{ active: currentTimeStamp === timeStamp }"
				:item="timeStamp"
				@click.native="select(timeStamp)"
			/>

			<div class="time-stamp add-one" @click="add">
				<div class="time-stamp-body">+</div>
			</div>
		</div>

		<div style="margin-top: 40px; text-align: left; line-height: 1.5;">
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

const DEFAULT_TIME_STAMPS_AMOUNT: number = 9

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapState(['currentTimeStamp', 'timeStampList']),
	},
	methods: {
		...RootMapper.mapActions(['select']),
		...RootMapper.mapMutations(['add', 'changeDescription']),
		...RootMapper.mapMutations({ onlySelect: 'select' }),
	},
})

@Component({ name: 'TimeStamps', components: { TimeStampItem } })
export default class TimeStampsComponent extends Mappers {
	created() {
		if (this.timeStampList.length === 0) {
			for (let i = 0; i < DEFAULT_TIME_STAMPS_AMOUNT; i += 1) {
				this.add()
			}
		}

		this.onlySelect(this.timeStampList[0])
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hello {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}

.time-stamp {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 12px;
	margin: 4px;
	cursor: pointer;
	user-select: none;
	border-radius: 8px;
	border: 1px solid lightblue;
	box-sizing: border-box;
	line-height: 1.5;
	position: relative;

	min-width: 120px;
	width: 100%;
	max-width: 32%;
	min-height: 120px;

	&-index {
		font-size: 20px;
	}

	&-description {
		font-size: 14px;
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

	&.active {
		background-color: lightblue;
	}

	&.add-one {
		border-color: transparent;
		justify-content: center;

		.time-stamp-body {
			width: 40px;
			height: 40px;
			line-height: 40px;
			border-radius: 100%;
			text-align: center;
			border: 1px solid lightblue;
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
  color: #42b983;
}
</style>