<script lang="ts">
	import { getContext } from 'svelte';

	const i18n = getContext('i18n');
</script>

<div class="p-6">
	<p>{$i18n.t('Context viewer placeholder')}</p>
</div>
