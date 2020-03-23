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
]