<template>
	<div id="app">
		<router-view/>

		<nav id="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/list">List</router-link>
			<router-link to="/info">Info</router-link>
		</nav>
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	padding-bottom: 40px;
}

#nav {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 12px;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 -1px 1px lightblue;
	line-height: 1;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>