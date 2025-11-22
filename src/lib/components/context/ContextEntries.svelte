<script lang="ts">
	import { getContext } from 'svelte';
	import { contextEntries } from '$lib/stores';
	import ContentRenderer from
		'../chat/Messages/ContentRenderer.svelte';
	import Markdown from '../chat/Messages/Markdown.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	const i18n = getContext('i18n');

	dayjs.extend(relativeTime);

	const formatTimestamp = (timestamp: number) => {
		return dayjs(timestamp).format('MMM D, YYYY HH:mm');
	};

	const formatRelativeTime = (timestamp: number) => {
		return dayjs(timestamp).fromNow();
	};
</script>

<div data-testid="entries-list" class="space-y-4">
	{#if $contextEntries.length === 0}
		<div
			class="flex items-center justify-center h-48
				text-gray-500 dark:text-gray-400"
		>
			<p class="text-center">
				{$i18n.t('No entries yet')}
			</p>
		</div>
	{:else}
		{#each $contextEntries as entry (entry.id)}
			<div
				data-testid="entry-{entry.id}"
				class="border border-gray-200 dark:border-gray-700
					rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
			>
				<div
					class="text-xs text-gray-500
						dark:text-gray-400 mb-2 flex
						items-center justify-between"
				>
					<span
						title={formatTimestamp(
							entry.timestamp
						)}
					>
						{formatRelativeTime(
							entry.timestamp
						)}
					</span>
				</div>
				<div
					class="text-sm text-gray-700
						dark:text-gray-300 markdown-content"
				>
					<Markdown content={entry.content} />
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
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
