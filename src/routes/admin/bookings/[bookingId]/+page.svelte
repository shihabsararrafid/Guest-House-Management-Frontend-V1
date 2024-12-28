<script lang="ts">
	import { page } from '$app/stores';
	import BookingEdit from '$lib/components/Booking/BookingEdit.svelte';

	const bookingId = $page.params.bookingId;
</script>

<BookingEdit {bookingId} />
