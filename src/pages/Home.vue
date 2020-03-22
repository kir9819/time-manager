<template>
	<div class="home">
		<InitComponent msg="Welcome to Your Vue.js App"/>
	</div>
</template>

<script>
import InitComponent from 'Components/InitComponent.vue'

export default {
	name: 'Home',
	components: {
		InitComponent,
	},
}
</script>