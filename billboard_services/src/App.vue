<script setup>
    import { RouterLink, RouterView } from 'vue-router'
	import Navbar from './components/์Navbar.vue'
	import SidebarMenu from './components/SidebarMenu.vue'
</script>

<template>
	<div id="app" class="bg-white">
		<Navbar/>
		<div id="body" class="flex justify-center">
			<SidebarMenu class="h-full"/>
			<div class="h-full w-[70%] m-3 p-2 border rounded-md">
				<RouterView/>
			</div>
		</div>
	</div>
</template>