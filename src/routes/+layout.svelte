<script>
	import './../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from './Footer.svelte';
	$: isAdminPage = $page.url.pathname.startsWith('/admin');
</script>

<div class="app">
	{#if !isAdminPage}
		<Header />
	{/if}

	<main>
		<slot />
	</main>
	{#if !isAdminPage}
		<Footer />
	{/if}
</div>
<SvelteToast />

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		margin-top: 100px;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
