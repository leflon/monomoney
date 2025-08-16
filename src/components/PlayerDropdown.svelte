<script lang="ts">
	import appState from '$lib/state.svelte';
	let { value = $bindable(), id = '' } = $props();
</script>

<select {id} bind:value>
	<option disabled value={null}>Select entity...</option>
	<option value={-1}>Bank</option>
	{#each appState.players as player}
		<option value={player.id}>{player.name}</option>
	{/each}
</select>
