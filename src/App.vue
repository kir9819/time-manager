<template>
	<div id="app">
		<router-view/>

		<nav id="nav" class="layout layout-container">
			<router-link to="/">Home</router-link>
			<!-- <router-link to="/list">List</router-link> -->
			<router-link to="/info">Info</router-link>
			<router-link to="/settings">Settings</router-link>
		</nav>
	</div>
</template>

<style lang="scss">
* {
	box-sizing: border-box;
}

body {
	min-width: 320px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	padding-bottom: 72px;
	padding-top: 24px;
	user-select: none;
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
	appearance: none;

	background-color: var(--color-layout);
	color: var(--root-color);
	border: 1px solid;
	border-radius: 8px;
	padding: 8px 12px;
	width: 100%;

	outline: none;

	&:focus {
		border-color: var(--color-active);
	}
}

.layout {
	background-color: var(--color-layout);

	&-container {
		padding-left: 12px;
		padding-right: 12px;
	}
}

.total-time {
	&-layout {
		width: 100%;
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 72px;
		left: 0;
	}

	&-body {
		padding: 12px;
		border-radius: 12px;
		max-width: 350px;
		width: 100%;
		box-shadow: 0 0 5px var(--root-background);
	}
}

.selectable {
	user-select: auto;
}
</style>