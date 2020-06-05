export default [
	{
		path: '/',
		name: 'Home',
		component: () => import('Pages/Home.vue'),
	},
	{
		path: '/list',
		name: 'List',
		component: () => import('Pages/List.vue'),
	},
	{
		path: '/info',
		name: 'Info',
		component: () => import('Pages/Info.vue'),
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('Pages/Settings.vue'),
	},
]