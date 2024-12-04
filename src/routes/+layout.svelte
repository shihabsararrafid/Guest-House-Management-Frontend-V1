<script>
	import './../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from './Footer.svelte';
	$: activeUrl = $page.url.pathname;
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
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
