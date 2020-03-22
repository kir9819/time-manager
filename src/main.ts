import Vue from 'vue'
import './registerServiceWorker'
import router from 'Plugins/router'
import store from 'Plugins/store'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')