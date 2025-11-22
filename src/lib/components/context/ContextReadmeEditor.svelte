<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import {
		contextId,
		contextReadme
	} from '$lib/stores';
	import { updateContextReadme } from
		'$lib/apis/contexts';
	import Modal from '../common/Modal.svelte';
	import Spinner from '../common/Spinner.svelte';

	const i18n = getContext('i18n');

	let readmeText = '';
	let isSaving = false;

	export let token: string;
	export let show = false;

	$: {
		if (show) {
			readmeText = $contextReadme;
		}
	}

	const handleSave = async () => {
		if (!$contextId) return;

		isSaving = true;
		try {
			await updateContextReadme(
				token,
				$contextId,
				readmeText
			);
			contextReadme.set(readmeText);
			show = false;
			toast.success(
				$i18n.t('README updated')
			);
		} catch (error) {
			console.error(
				'Failed to update README:',
				error
			);
			toast.error(
				$i18n.t('Failed to update README')
			);
		} finally {
			isSaving = false;
		}
	};

	const handleCancel = () => {
		readmeText = $contextReadme;
		show = false;
	};
</script>

{#if show}
	<Modal {show} size="lg" on:overlay-click={handleCancel}>
		<div class="p-6">
			<h2 class="text-lg font-semibold mb-4
				text-gray-900 dark:text-white">
				{$i18n.t('Edit README')}
			</h2>

			<textarea
				bind:value={readmeText}
				placeholder={$i18n.t(
					'Enter README content (markdown supported)'
				)}
				class="w-full px-4 py-2 border
					border-gray-300 dark:border-gray-600
					rounded-lg bg-white dark:bg-gray-800
					text-gray-900 dark:text-gray-100
					placeholder-gray-500
					dark:placeholder-gray-400 resize-none
					focus:outline-none focus:ring-2
					focus:ring-blue-500
					dark:focus:ring-blue-400"
				rows="12"
			/>

			<div class="mt-6 flex justify-end gap-3">
				<button
					on:click={handleCancel}
					disabled={isSaving}
					class="px-4 py-2 bg-gray-300
						dark:bg-gray-600 text-gray-900
						dark:text-white rounded-lg font-medium
						hover:bg-gray-400 dark:hover:bg-gray-500
						disabled:opacity-50"
				>
					{$i18n.t('Cancel')}
				</button>

				<button
					on:click={handleSave}
					disabled={isSaving}
					data-testid="save-readme-btn"
					class="px-4 py-2 bg-blue-500 text-white
						rounded-lg font-medium
						hover:bg-blue-600 disabled:opacity-50
						flex items-center gap-2"
				>
					{#if isSaving}
						<Spinner size="sm" />
					{/if}
					{$i18n.t('Save')}
				</button>
			</div>
		</div>
	</Modal>
{/if}
