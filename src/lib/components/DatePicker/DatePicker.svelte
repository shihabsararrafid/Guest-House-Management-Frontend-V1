<script lang="ts">
	/**
	 * INSTALL
	 * yarn add dayjs
	 *
	 * USAGE
	 * import DatePicker from './DatePicker.svelte'
	 * function datepicked (e) { console.log(e.detail.datepicked) }
	 *
	 * <DatePicker
	 *  on:datepicked={datepicked}
	 *  customclass=""                  (facultative) css class
	 * />
	 */

	import { createEventDispatcher, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/fr';
	export let label = '';

	// data
	const dispatch = createEventDispatcher();
	let elModal: HTMLElement; // HTMLElement
	let inputTxt: string; // string, défault date = now
	let isOpenCalendar = false; // true: show calendar
	const arrDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const currentDay = +dayjs().format('D'); // 1..31
	const currentMonth = +dayjs().format('M'); // 1..12
	const currentYear = +dayjs().format('YYYY'); // 2021...
	let selectedMonth = +dayjs().format('M'); // 1..12
	let selectedYear = +dayjs().format('YYYY'); // 2021...
	let rows = initRows();

	// reactivity, on inputTxt changes
	$: dispatch('datepicked', {
		datepicked: inputTxt
	});

	// life cycle
	onMount(() => {
		dayjs.locale('en'); // use locale
		inputTxt = dayjs().format('YYYY-MM-DD'); // current day month year in input
		affecteRows();
	});

	// functions
	/**
	 * Click outside of the modal will close it
	 * @param e
	 */
	function handleClickModal(e: { target: any }) {
		if (e.target === elModal) {
			isOpenCalendar = false;
		}
	}

	function initRows() {
		return [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		];
	}

	function affecteRows() {
		rows = initRows();
		const firstDayOfCurrentMonth = ucFirst(
			dayjs(selectedYear + '-' + selectedMonth)
				.startOf('month')
				.format('ddd')
		); // 'Lu'
		const lastDayOfCurrentMonth = +dayjs(selectedYear + '-' + selectedMonth)
			.endOf('month')
			.format('D'); // 31
		let iRow = 0;
		let iCol = 0;
		let start = false;
		let cpt = 0;
		for (iRow = 0; iRow < 6; iRow++) {
			arrDays.forEach((daystr) => {
				if (cpt > lastDayOfCurrentMonth) {
					return;
				}
				if (!start && daystr === firstDayOfCurrentMonth) {
					cpt++;
					start = true;
				}
				rows[iRow][iCol] = cpt;
				iCol++;
				if (start) {
					cpt++;
				}
			});
			iCol = 0;
		}
	}

	function ucFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function previousMonth() {
		selectedMonth--;
		if (selectedMonth <= 0) {
			selectedMonth = 12;
			selectedYear--;
		}
		affecteRows();
	}

	function nextMonth() {
		selectedMonth++;
		if (selectedMonth > 12) {
			selectedMonth = 1;
			selectedYear++;
		}
		affecteRows();
	}

	function selectDate(y: string | number, m: string | number, d: string | number) {
		inputTxt = dayjs(y + '-' + m + '-' + d).format('YYYY-MM-DD');
		isOpenCalendar = false;
	}
	function clickOutside(element: HTMLDivElement, callbackFunction: (() => void) | undefined) {
		function onClick(event: any) {
			if (!element.contains(event.target)) {
				console.log('here');
				callbackFunction?.();
			}
		}

		document.body.addEventListener('click', onClick);

		return {
			update(newCallbackFunction: (() => void) | undefined) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		};
	}
</script>

{#if isOpenCalendar}
	<div
		role="button"
		tabindex={0}
		on:keypress={handleClickModal}
		class="fixed z-40 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-40"
		bind:this={elModal}
		on:click={handleClickModal}
		use:clickOutside={() => {
			console.log('clicked outside');
			// isOpenCalendar = false;
		}}
	>
		<div class="flex items-center justify-center py-8 px-4">
			<div class="max-w-sm w-full shadow-lg">
				<div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
					<div class="px-4 flex items-center justify-between">
						<!-- Month year -->
						<span class="focus:outline-none text-base font-bold text-gray-800"
							>{ucFirst(dayjs(selectedYear + '-' + selectedMonth).format('MMMM YYYY'))}</span
						>
						<div class="flex items-center">
							<!-- bnt previous -->
							<button on:click={previousMonth} aria-label="calendar backward" class="text-gray-800">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-chevron-left"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<polyline points="15 6 9 12 15 18" />
								</svg>
							</button>
							<!-- bnt next -->
							<button on:click={nextMonth} aria-label="calendar forward" class="ml-3 text-gray-800">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-chevron-right"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<polyline points="9 6 15 12 9 18" />
								</svg>
							</button>
						</div>
					</div>
					<div class="flex items-center justify-between pt-12 overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr>
									{#each arrDays as day}
										<th>
											<div class="w-full flex justify-center">
												<p class="text-base font-medium text-center text-gray-800">
													{day}
												</p>
											</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each rows as col}
									<tr>
										{#each col as i}
											<td class="pt-4">
												<div class="px-2 py-2 cursor-pointer flex w-full justify-center">
													{#if i > 0}
														{#if i === +dayjs(inputTxt).format('D') && selectedMonth === +dayjs(inputTxt).format('M') && selectedYear === +dayjs(inputTxt).format('YYYY')}
															<button
																on:click={() => {
																	selectDate(selectedYear, selectedMonth, i);
																}}
																class="rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:bg-indigo-500 hover:bg-indigo-500 text-base w-8 h-8 flex items-center justify-center font-medium text-white bg-indigo-700"
																>{i}</button
															>
														{:else}
															<p class="text-base text-gray-500 font-medium">
																<button
																	class="border-none"
																	on:click={() => {
																		selectDate(selectedYear, selectedMonth, i);
																	}}
																>
																	{i}
																</button>
															</p>
														{/if}
													{/if}
												</div>
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
<button
	type="button"
	on:click={() => {
		console.log('here');
		isOpenCalendar = true;
	}}
	class="border-bg-blue-100 w-full cursor-pointer hover:bg-blue-100 border-[1px] px-3 py-2 rounded-md inline-block text-left"
	aria-haspopup="dialog"
>
	<p class="text-xs text-blue-400 font-semibold uppercase">{label}</p>
	<p class="text-xs">
		<span class="text-sm">{dayjs(inputTxt).format("DD MMM 'YY")} </span>
	</p>
	<p class="text-xs">{dayjs(inputTxt).format('dddd')}</p>
</button>
