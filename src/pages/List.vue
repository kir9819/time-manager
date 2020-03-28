<template>
	<div id="page-list">
		<div
			v-for="timeStamp in timeStampList"
			:key="timeStamp.index"
			class="list-item layout"
		>
			<span class="list-item-index">{{ timeStamp.index }}</span>
			<input
				:value="timeStamp.description"
				class="list-item-input"
				@change="changeDescription({ index: timeStamp.index, description: $event.target.value })"
			>
			<span class="list-item-clear" @click="clearTimeStamps(timeStamp.index)">Очистить</span>
		</div>

		<div class="clear-all" @click="clearAllTimeStamps">Очистить все</div>
	</div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'

const Mappers = Vue.extend({
	computed: {
		...RootMapper.mapState(['timeStampList']),
		...RootMapper.mapGetters(['currentTimeStamp']),
	},
	methods: {
		...RootMapper.mapMutations(['changeDescription']),
		...RootMapper.mapActions(['clearTimeStamps', 'clearAllTimeStamps']),
	},
})

@Component({ name: 'TimeStampListPage' })
export default class TimeStampsComponent extends Mappers {}
</script>

<style lang="scss">
#page-list {
	display: flex;
	flex-direction: column;
	align-items: center;

	.list-item {
		padding: 16px 8px;
		margin: 4px;
		border-radius: 8px;
		max-width: 320px;
		width: 100%;
		box-sizing: border-box;

		&-index {
			margin-right: 8px;
		}

		&-clear {
			cursor: pointer;
			margin-left: 8px;

			font-size: 12px;
		}
	}

	.clear-all {
		cursor: pointer;
		margin-top: 16px;
		font-size: 12px;
	}
}
</style>