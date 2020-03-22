<template>
	<div class="hello">
		<div
			v-for="timeStamp in timeStampList"
			:key="timeStamp.index"
			class="time-stamp"
			:class="{ active: currentTimeStamp === timeStamp }"
			@click="changeCurrentTimeStamp(timeStamp)"
		>{{ timeStamp.index }}</div>

		<div class="time-stamp add-one" @click="add">+</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TimeStamp } from './TimeStamp'

@Component({ name: 'TimeStamps' })
export default class TimeStamps extends Vue {
	timeStampList: Array<TimeStamp>

	currentTimeStamp: TimeStamp

	constructor() {
		super()

		const firstTimeStamp = new TimeStamp('')

		this.timeStampList = new Array(firstTimeStamp)
		this.currentTimeStamp = firstTimeStamp
	}

	get sortedList() {
		const timeStampListCopy = [...this.timeStampList]
		return timeStampListCopy.sort((ts1, ts2) => ts1.index - ts2.index)
	}

	add(): void {
		this.timeStampList.push(new TimeStamp(''))
	}

	changeCurrentTimeStamp(timeStamp: TimeStamp): void {
		this.currentTimeStamp = timeStamp
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
	display: flex;
	justify-content: center;
}

.time-stamp {
	padding: 12px;
	margin: 4px;
	cursor: pointer;
	border-radius: 8px;
	border: 1px solid transparent;

	&.active, &.add-one {
		border: 1px solid lightblue;
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