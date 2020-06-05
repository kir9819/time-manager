<template>
	<div id="page-settings" class="layout-container">
		<div class="settings-item" @click="showDevelopItems">
			<span class="settings-item-description">Save backup on device</span>
			<div class="action-button" @click="getFullDB">Download</div>
		</div>

		<div v-if="developMenu" class="settings-item settings-alert">Next settings can drop your data!</div>

		<div v-if="developMenu" class="settings-item">
			<span class="settings-item-description">Upload saved backup from device</span>
			<div class="action-button" @click="uploadFile">Upload</div>
			<input
				v-show="false"
				ref="dataUpload"
				type="file"
				accept="application/json"
				@change="dataUploaded"
			>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RootMapper } from 'Plugins/store/modules/root'
import { RootMapper as InfoMapper } from 'Plugins/store/modules/info'
import DB from 'Plugins/db'
import { downloadFile, getDate } from 'Utils/index'

const Mappers = Vue.extend({
	methods: {
		...RootMapper.mapActions({ rootInit: '$init' }),
		...InfoMapper.mapActions({ infoInit: '$init' }),
	},
})

@Component({ name: 'SettingsPage' })
export default class SettingsPage extends Mappers {
	$refs!: {
		dataUpload: HTMLInputElement
	}

	stepsToDevelopMenu = 0

	developMenu = false

	dataUpload: any

	DB = DB

	async getFullDB(): Promise<void> {
		const db = await this.DB.getDBObject()

		downloadFile(new Blob([JSON.stringify(db)], { type: 'application/json' }), `time-manager-${getDate()}.json`)
	}

	async uploadFile(): Promise<void> {
		this.$refs.dataUpload.click()
	}

	dataUploaded($event: InputEvent) {
		if (!$event.target) return

		const target = $event.target as HTMLInputElement

		if (!target.files) return

		const answer = confirm('Are you sure you want to upload data? This action cannot be undone!') // eslint-disable-line

		if (!answer) return

		const file = target.files[0]
		const reader = new FileReader()

		reader.readAsText(file, 'UTF-8')

		reader.onload = async readerEvent => {
			if (!readerEvent.target) return

			const data = readerEvent.target.result as string

			await this.DB.createDBFromObject(JSON.parse(data))

			await this.rootInit()
			await this.infoInit()
		}
	}

	showDevelopItems() {
		if (this.developMenu) return

		this.stepsToDevelopMenu += 1

		if (this.stepsToDevelopMenu > 10) this.developMenu = true
	}
}
</script>

<style lang="scss">
#page-settings {
	.action-button {
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid var(--root-color);
		cursor: pointer;
	}

	.settings {
		&-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			max-width: 420px;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 12px;

			&-description {
				margin-right: 8px;
			}
		}

		&-alert {
			color: var(--color-danger);
			margin-top: 36px;
			margin-bottom: 24px;
			justify-content: center;
		}
	}
}
</style>