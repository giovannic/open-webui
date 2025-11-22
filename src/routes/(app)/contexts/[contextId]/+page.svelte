<script lang="ts">
	import { getContext } from 'svelte';

	import { WEBUI_NAME } from '$lib/stores';
	import ContextViewer from
		'$lib/components/context/ContextViewer.svelte';

	const i18n = getContext('i18n');
</script>

<svelte:head>
	<title>
		{$i18n.t('Context')} • {$WEBUI_NAME}
	</title>
</svelte:head>

<ContextViewer />
