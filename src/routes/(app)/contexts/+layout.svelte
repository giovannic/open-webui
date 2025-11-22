<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount, getContext } from 'svelte';
	import { goto } from '$app/navigation';

	import {
		contexts,
		contextId,
		showSidebar,
		mobile,
		WEBUI_NAME
	} from '$lib/stores';
	import { listContexts } from '$lib/apis/contexts';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';
	import Spinner from '$lib/components/common/Spinner.svelte';

	const i18n = getContext('i18n');

	let loading = false;

	const loadContexts = async () => {
		loading = true;
		try {
			const token = localStorage.getItem('token') || '';
			const response = await listContexts(token, 50, 0);
			contexts.set(response.contexts);
		} catch (error) {
			console.error('Failed to load contexts:', error);
			toast.error('Failed to load contexts');
		} finally {
			loading = false;
		}
	};

	const selectContext = (id: string) => {
		contextId.set(id);
		if ($mobile) {
			showSidebar.set(false);
		}
		goto(`/contexts/${id}`);
	};

	onMount(async () => {
		await loadContexts();
	});
</script>

<svelte:head>
	<title>
		{$i18n.t('Contexts')} • {$WEBUI_NAME}
	</title>
</svelte:head>

<div class="flex flex-col w-full h-screen max-h-[100dvh] transition-width duration-200 ease-in-out {$showSidebar ? 'md:max-w-[calc(100%-260px)]' : ''} max-w-full">
	<nav class="px-2.5 pt-1.5 backdrop-blur-xl w-full drag-region flex items-center">
		{#if $mobile}
			<div class="{$showSidebar ? 'md:hidden' : ''} flex flex-none items-center self-end mt-1.5">
				<Tooltip
					content={$showSidebar ? $i18n.t('Close Sidebar') : $i18n.t('Open Sidebar')}
					interactive={true}
				>
					<button
						id="sidebar-toggle-button"
						class="cursor-pointer flex rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition"
						on:click={() => {
							showSidebar.set(!$showSidebar);
						}}
					>
						<div class="self-center p-1.5">
							<Sidebar />
						</div>
					</button>
				</Tooltip>
			</div>
		{/if}

		<div class="flex w-full">
			<h1 class="text-xl font-semibold p-2">
				{$i18n.t('Contexts')}
			</h1>
		</div>
	</nav>

	<div class="flex flex-1 max-h-[calc(100%-60px)] overflow-hidden">
		{#if $showSidebar}
			<aside class="hidden md:flex w-60 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex-col bg-white dark:bg-gray-950">
				<div class="p-4 space-y-2">
					<button
						class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
						data-testid="new-context-btn"
						on:click={() => goto('/contexts/new')}
					>
						{$i18n.t('New Context')}
					</button>

					{#if loading}
						<div class="flex justify-center py-4">
							<Spinner />
						</div>
					{:else if $contexts.length === 0}
						<p class="text-center text-gray-500 py-4">
							{$i18n.t('No contexts yet')}
						</p>
					{:else}
						<div class="space-y-1">
							{#each $contexts as context (context.id)}
								<button
									class="w-full text-left px-3 py-2 rounded-lg transition {$contextId === context.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
									data-testid="context-item-{context.id}"
									on:click={() => selectContext(context.id)}
								>
									<div class="truncate">
										{context.uri}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</aside>
		{/if}

		<main class="flex-1 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
