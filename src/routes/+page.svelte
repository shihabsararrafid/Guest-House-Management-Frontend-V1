<script>
	import { Button, Card, Input, Label, Select } from 'flowbite-svelte';
	import { HeroBody, HeroHeader, News } from 'flowbite-svelte-blocks';
	import { AddressBookSolid, ArrowRightOutline, VideoCameraSolid } from 'flowbite-svelte-icons';
	import Header from './Header.svelte';
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
			<Card class="w-full max-w-4xl mx-auto mb-8">
				<form class="flex flex-col md:flex-row gap-4">
					<div>
						<Label for="check-in">Check In</Label>
						<Input id="check-in" type="date" value="2024-09-08" />
					</div>
					<div>
						<Label for="check-out">Check Out</Label>
						<Input id="check-out" type="date" value="2024-09-09" />
					</div>
					<div>
						<Label for="guests">Rooms & Guests</Label>
						<Select id="guests">
							<option>1 Room, 2 Guests</option>
							<option>2 Rooms, 4 Guests</option>
							<option>3 Rooms, 6 Guests</option>
						</Select>
					</div>
				</form>
				<div class="flex items-end">
					<Button color="yellow" class="w-[120px]">Search</Button>
				</div>
			</Card>
		</div>
		<!-- <News>
			<span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
			<span class="text-sm font-medium">Flowbite is out! See what's new</span>
		</News> -->
	</div>
</div>
