import Vue from 'vue'
import axios, { AxiosStatic } from 'axios'

let httpInstance = {}

if (process.env.VUE_APP_URL_API) {
	httpInstance = axios.create({
		// baseURL: process.env.VUE_APP_URL_API,
	})
}

export const http = httpInstance

declare module 'vue/types/vue' {
	interface Vue {
		$http: AxiosStatic,
	}
}

// export as vue plugin
export default {
	install(vue: any) {
		vue.prototype.$http = httpInstance
	},
}