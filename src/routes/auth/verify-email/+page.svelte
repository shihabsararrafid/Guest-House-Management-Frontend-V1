<script>
	import AskingForVerfication from './../../../lib/components/verifyEmail/asking-for-verfication.svelte';
	import FailedVerificationMessage from './../../../lib/components/verifyEmail/failed-verification-message.svelte';
	import SuccessMessage from './../../../lib/components/verifyEmail/success-message.svelte';
	import { page } from '$app/stores';
	import VerifyToken from '$lib/components/verifyEmail/verify-token.svelte';
	const p = $page.url.searchParams.get('message'); // e.g., ?page=about
	const token = $page.url.searchParams.get('token');
	const email = $page.url.searchParams.get('email');
	console.log(p, 'page');
</script>

{#if token && email}
	<VerifyToken />
{:else if p === 'asking-for-verification'}
	<AskingForVerfication />
{:else if p === 'success'}
	<SuccessMessage />
{:else}
	<FailedVerificationMessage />
{/if}
