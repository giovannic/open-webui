<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import {
		contextId,
		contextReadme,
		contextEntries,
		contextTotal
	} from '$lib/stores';
	import {
		getContext,
		getContextReadme
	} from '$lib/apis/contexts';
	import Spinner from '$lib/components/common/Spinner.svelte';

	let loading = false;

	const loadContextDetails = async (cId: string) => {
		loading = true;
		try {
			const token = localStorage.getItem('token') || '';

			// Load context entries and readme in parallel
			const [entriesRes, readmeRes] = await Promise.all([
				getContext(token, cId, 'asc', 20, 0),
				getContextReadme(token, cId)
			]);

			contextEntries.set(entriesRes.entries);
			contextTotal.set(entriesRes.total);
			contextReadme.set(readmeRes.readme || '');
		} catch (error) {
			console.error('Failed to load context details:', error);
			toast.error('Failed to load context details');
			// Redirect to contexts list on error
			goto('/contexts');
		} finally {
			loading = false;
		}
	};

	onMount(async () => {
		const cId = $page.params.contextId;
		contextId.set(cId);
		await loadContextDetails(cId);
	});
</script>

{#if loading}
	<div class="flex items-center justify-center h-full w-full">
		<Spinner />
	</div>
{:else}
	<slot />
{/if}
