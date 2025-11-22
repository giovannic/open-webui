<script lang="ts">
	import { getContext } from 'svelte';

	const i18n = getContext('i18n');
</script>

<div class="p-6 text-center">
	<p>{$i18n.t('Select a context from the sidebar')}</p>
</div>
