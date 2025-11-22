<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import {
		contextId,
		contextEntries
	} from '$lib/stores';
	import { addContextEntry } from
		'$lib/apis/contexts';
	import Spinner from '../common/Spinner.svelte';

	const i18n = getContext('i18n');

	let inputText = '';
	let isSubmitting = false;
	let inputElement: HTMLTextAreaElement;

	export let token: string;

	const handleSubmit = async () => {
		if (!inputText.trim() || !$contextId) {
			return;
		}

		isSubmitting = true;
		const content = inputText.trim();

		try {
			// Optimistic update
			const tempId = `temp-${Date.now()}`;
			contextEntries.update((entries) => [
				...entries,
				{
					id: tempId,
					content,
					timestamp: Date.now()
				}
			]);

			const response = await addContextEntry(
				token,
				$contextId,
				content
			);

			// Update with real ID from server
			contextEntries.update((entries) => {
				const idx = entries.findIndex(
					(e) => e.id === tempId
				);
				if (idx !== -1) {
					entries[idx].id = response.id;
				}
				return entries;
			});

			inputText = '';
			toast.success($i18n.t('Entry added'));

			// Focus input for next entry
			if (inputElement) {
				inputElement.focus();
			}
		} catch (error) {
			console.error('Failed to add entry:', error);

			// Remove optimistic update on error
			contextEntries.update((entries) =>
				entries.filter(
					(e) => !e.id.startsWith('temp-')
				)
			);

			// Keep text in input for retry
			toast.error(
				$i18n.t('Failed to add entry - retry with '
					+ 'Ctrl+Enter')
			);
		} finally {
			isSubmitting = false;
		}
	};

	const handleKeyDown = (
		event: KeyboardEvent
	) => {
		// Submit on Ctrl/Cmd + Enter, newline on Shift + Enter
		if (
			(event.ctrlKey || event.metaKey) &&
			event.key === 'Enter'
		) {
			event.preventDefault();
			handleSubmit();
		}
	};
</script>

<div class="flex flex-col gap-2">
	<textarea
		bind:this={inputElement}
		bind:value={inputText}
		on:keydown={handleKeyDown}
		disabled={isSubmitting || !$contextId}
		placeholder={$i18n.t('Add an entry...')}
		data-testid="entry-input"
		class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base
			border border-gray-300 dark:border-gray-600
			rounded-lg bg-white dark:bg-gray-800
			text-gray-900 dark:text-gray-100
			placeholder-gray-500 dark:placeholder-gray-400
			resize-none focus:outline-none focus:ring-2
			focus:ring-blue-500 dark:focus:ring-blue-400
			disabled:opacity-50 disabled:cursor-not-allowed
			min-h-[80px] sm:min-h-[100px]"
		rows="3"
	/>

	<div class="flex justify-end gap-2">
		<button
			on:click={handleSubmit}
			disabled={
				isSubmitting ||
				!$contextId ||
				!inputText.trim()
			}
			data-testid="submit-entry-btn"
			class="px-3 sm:px-4 py-2 text-sm sm:text-base
				h-10 sm:h-auto bg-blue-500 text-white
				rounded-lg font-medium hover:bg-blue-600
				disabled:opacity-50 disabled:cursor-not-allowed
				flex items-center gap-2"
		>
			{#if isSubmitting}
				<Spinner size="sm" />
			{/if}
			{$i18n.t('Submit')}
		</button>
	</div>

	<p class="text-xs text-gray-500 dark:text-gray-400">
		{$i18n.t('Ctrl+Enter to submit')}
	</p>
</div>
