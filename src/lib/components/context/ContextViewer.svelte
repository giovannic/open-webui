<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import {
		contextId,
		contextReadme,
		contextEntries,
		contextTotal
	} from '$lib/stores';
	import { getContext as getContextAPI } from
		'$lib/apis/contexts';
	import Spinner from '../common/Spinner.svelte';
	import Markdown from '../chat/Messages/Markdown.svelte';
	import ContextEntries from './ContextEntries.svelte';
	import AddEntryInput from './AddEntryInput.svelte';
	import ContextReadmeEditor from
		'./ContextReadmeEditor.svelte';

	const i18n = getContext('i18n');

	let loading = false;
	let readmeCollapsed = true;
	let currentOffset = 0;
	let allEntriesLoaded = false;
	let showReadmeEditor = false;

	export let token: string;

	const loadMoreEntries = async () => {
		if (!$contextId || allEntriesLoaded) return;

		loading = true;
		try {
			const response = await getContextAPI(
				token,
				$contextId,
				'asc',
				20,
				currentOffset
			);
			currentOffset += response.entries.length;
			contextEntries.update((entries) => [
				...entries,
				...response.entries
			]);

			if (currentOffset >= response.total) {
				allEntriesLoaded = true;
			}
		} catch (error) {
			toast.error(
				$i18n.t('Failed to load more entries')
			);
		} finally {
			loading = false;
		}
	};

	const toggleReadme = () => {
		readmeCollapsed = !readmeCollapsed;
	};

	$: readmePreview =
		$contextReadme.length > 100
			? $contextReadme.substring(0, 100) + '...'
			: $contextReadme;
</script>

<div class="flex flex-col h-full overflow-hidden">
	<!-- README Section -->
	<div
		class="border-b border-gray-200 dark:border-gray-700
			px-4 sm:px-6 py-4 bg-white dark:bg-gray-900"
	>
		<div class="flex items-center justify-between mb-2">
			<button
				on:click={toggleReadme}
				class="text-sm font-medium text-gray-700
					dark:text-gray-300 hover:text-gray-900
					dark:hover:text-gray-100"
			>
				{#if readmeCollapsed}
					<span>▶</span>
				{:else}
					<span>▼</span>
				{/if}
				{$i18n.t('README')}
			</button>
			<button
				on:click={() =>
					(showReadmeEditor = true)}
				data-testid="edit-readme-btn"
				class="px-3 py-1 text-xs bg-blue-500
					text-white rounded hover:bg-blue-600"
			>
				{$i18n.t('Edit')}
			</button>
		</div>

		{#if !readmeCollapsed}
			<div class="text-sm text-gray-600 dark:text-gray-400
				mt-2 markdown-content">
				{#if $contextReadme}
					<Markdown content={$contextReadme} />
				{:else}
					<p class="italic">
						{$i18n.t('No README set')}
					</p>
				{/if}
			</div>
		{:else if $contextReadme}
			<p class="text-sm text-gray-600 dark:text-gray-400">
				{readmePreview}
			</p>
		{:else}
			<p class="text-sm italic text-gray-500
				dark:text-gray-500">
				{$i18n.t('No README set')}
			</p>
		{/if}
	</div>

	<!-- Entries Section -->
	<div
		class="flex-1 overflow-y-auto flex flex-col bg-white
			dark:bg-gray-900"
	>
		<!-- Entries List -->
		<div class="flex-1 px-4 sm:px-6 py-4">
			<ContextEntries />
		</div>

		<!-- Load More Button -->
		{#if !allEntriesLoaded && $contextEntries.length > 0}
			<div class="px-4 sm:px-6 py-4 border-t border-gray-200
				dark:border-gray-700 text-center">
				<button
					on:click={loadMoreEntries}
					disabled={loading}
					class="px-4 py-2 bg-gray-200
						dark:bg-gray-700 text-gray-800
						dark:text-gray-200 rounded
						hover:bg-gray-300 dark:hover:bg-gray-600
						disabled:opacity-50"
				>
					{#if loading}
						<span class="inline-block mr-2">
							<Spinner size="sm" />
						</span>
					{/if}
					{$i18n.t('Load more')}
				</button>
			</div>
		{/if}
	</div>

	<!-- Input Section -->
	<div class="border-t border-gray-200 dark:border-gray-700
		px-4 sm:px-6 py-4 bg-white dark:bg-gray-900">
		<AddEntryInput {token} />
	</div>
</div>

<ContextReadmeEditor
	{token}
	bind:show={showReadmeEditor}
/>

<style>
	:global(body) {
		overflow: hidden;
	}

	:global(.markdown-content) {
		font-size: 0.95rem;
		line-height: 1.6;
	}

	:global(.markdown-content :first-child) {
		margin-top: 0;
	}

	:global(.markdown-content :last-child) {
		margin-bottom: 0;
	}

	:global(.markdown-content pre) {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.75rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		margin: 0.5rem 0;
	}

	:global(.markdown-content code) {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: monospace;
	}
</style>
