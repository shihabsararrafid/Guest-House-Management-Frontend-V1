<script>
	import { Button, Card, Datepicker, Input, Label, Select } from 'flowbite-svelte';
	import { HeroBody, HeroHeader, News } from 'flowbite-svelte-blocks';
	import { AddressBookSolid, ArrowRightOutline, VideoCameraSolid } from 'flowbite-svelte-icons';
	import SearchRoom from './SearchRoom.svelte';
	import DatePicker from '../DatePicker/DatePicker.svelte';
</script>

<div
	class="min-h-screen w-full flex flex-col justify-between bg-cover bg-center"
	style="background-image: url('/ruet_guest_house.jpg'); opacity: 10;"
>
	<div
		class="bg-black flex justify-center items-center mt-[80px] bg-opacity-10 min-h-screen text-white py-8"
	>
		<div>
			<div class="flex justify-center my-10">
				<News class="mx-auto">
					<span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
					<span class="text-sm font-medium">Online booking now available!</span>
				</News>
			</div>
			<HeroHeader>
				<h1 class="text-6xl font-bold text-center">Welcome to University Guest House</h1>
				<p class=" text-lg my-5 font-semibold">
					Experience comfortable and convenient accommodation right on campus. Our guest house
					offers a perfect blend of academic atmosphere and modern amenities for visitors, faculty,
					and alumni.
				</p>
			</HeroHeader>

			<div
				class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
			>
				<a href="/">
					<Button size="lg" color="red">
						See Pricing <ArrowRightOutline size="lg" class="ml-2 -mr-1" />
					</Button>
				</a>
				<a href="/">
					<Button size="lg" color="light">
						<AddressBookSolid size="lg" class="mr-2 -ml-1" />
						Contact Us
					</Button>
				</a>
			</div>
			<Card class="lg:w-1/2 py-3 relative max-w-4xl mx-auto mb-8">
				<form class="flex flex-col mb-10 md:flex-row gap-4">
					<div class="grow">
						<DatePicker label="Check In" />
					</div>
					<div class="grow">
						<DatePicker label="Check Out" />
					</div>
					<div class="grow">
						<SearchRoom />
					</div>
				</form>
				<div class="flex items-end absolute -bottom-5 left-1/2">
					<Button color="yellow" class="w-[120px]">Search</Button>
				</div>
			</Card>
		</div>
	</div>
</div>
