<template>
	<div id="app">
		<router-view/>

		<nav id="nav" class="layout layout-container">
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
	padding-bottom: 72px;
	padding-top: 24px;
}

#nav {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding-top: 20px;
	padding-bottom: 20px;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 -1px 5px var(--root-background);
	line-height: 1;

	a {
		font-weight: bold;
		color: var(--root-color);

		&.router-link-exact-active {
			color: var(--color-active);
		}
	}
}

input {
	background-color: var(--color-layout);
	color: var(--root-color);
	border: 1px solid;
	padding: 4px 8px;
}

.layout {
	background-color: var(--color-layout);

	&-container {
		padding-left: 12px;
		padding-right: 12px;
	}
}
</style>