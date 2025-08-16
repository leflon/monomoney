<script lang="ts">
	import appState from '$lib/state.svelte';
	import PlayerPanel from './PlayerPanel.svelte';

	function onDeletePlayer(playerId: number) {
		if (!confirm('Are you sure you want to delete this player?')) return;
		appState.players = appState.players.filter((player) => player.id !== playerId);
		if (appState.selectedPayer === playerId) appState.selectedPayer = null;
		if (appState.selectedRecipient === playerId) appState.selectedRecipient = null;
	}
</script>

<div class="container">
	<h2>Players</h2>
	<div class="players-grid">
		{#each appState.players as player, i}
			<PlayerPanel
				bind:player={appState.players[i]}
				index={i}
				ondelete={() => onDeletePlayer(player.id)}
			/>
		{/each}
		<PlayerPanel index={-1} player={{ id: -1, name: 'Bank', balance: Infinity }} />
	</div>
</div>

<style scoped>
	.container {
		margin: 20px;
	}

	h2 {
		text-align: center;
		margin-bottom: 20px;
		font-size: 1.5em;
	}

	.players-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
</style>
