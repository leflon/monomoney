<script lang="ts">
	import appState from '$lib/state.svelte';
	import type { Player } from '$lib/types';

	const PLAYER_COLORS = [
		'#FF5733', // Vibrant Red-Orange
		'#4A90E2', // Bright Blue (matches accent)
		'#77DD77', // Pastel Green
		'#FDFD96', // Pastel Yellow
		'#FFB347', // Pastel Orange
		'#C3B1E1', // Pastel Purple
		'#50E3C2', // Aqua Green
		'#F5A623' // Orange
	];

	type Props = {
		player: Player;
		index: number;
		ondelete?: () => void;
	};

	let { player = $bindable(), index, ondelete }: Props = $props();

	let isFocused = $state(false);
	let isEditing = $state(false);
	let oldName = $state(player.name);

	let thisRef: HTMLDivElement;

	/** Fires when the panel switches to editing mode, and the input element is mounted. */
	const autofocus = (node: HTMLInputElement) => {
		node.focus();
		node.select();
	};

	/** Selects the current player */
	const selectPlayer = () => {
		if (appState.selectedPayer === null) appState.selectedPayer = player.id;
		else if (appState.selectedPayer !== player.id) appState.selectedRecipient = player.id;
	};

	const focusIn = () => {
		isFocused = true;
		selectPlayer();
	};

	const focusOut = () => {
		isFocused = false;
		thisRef.blur();
	};

	const FOCUS_KEY = player.name === 'Bank' ? 'KeyB' : `Digit${index + 1}`;
	const windowKeyDown = (e: KeyboardEvent) => {
		if (e.code !== FOCUS_KEY || !e.altKey) return;
		e.preventDefault();
		focusIn();
	};

	const windowKeyUp = (e: KeyboardEvent) => {
		if (e.code !== FOCUS_KEY) return;
		e.preventDefault();
		focusOut();
	};

	/** Fires when the panel is being focused and a key is pressed */
	const panelKeyDown = (e: KeyboardEvent) => {
		if (e.target !== thisRef) return; // Ignore if event is triggered from a child element (e.g. input)
		if (e.key === 'Enter' || e.key === ' ') {
			// Mimic real button behavior
			e.preventDefault();
			selectPlayer();
			focusOut();
		}
	};

	const startEdit = () => {
		isEditing = true;
	};

	const finishEdit = () => {
		if (!player.name) player.name = oldName;
		oldName = player.name;
		focusOut();
		isEditing = false;
	};
</script>

<svelte:window onkeydown={windowKeyDown} onkeyup={windowKeyUp} onmouseup={focusOut} />

<div
	class="player-panel"
	role="button"
	class:focused={isFocused}
	style:--player-color={PLAYER_COLORS[index % PLAYER_COLORS.length]}
	tabindex="0"
	bind:this={thisRef}
	onkeydown={panelKeyDown}
	onmousedown={focusIn}
	onmouseup={focusOut}
>
	<div class="heading">
		{#if isEditing}
			<form
				class="name-form"
				onsubmit={(e) => {
					e.preventDefault();
					finishEdit();
				}}
			>
				<input
					type="text"
					class="name"
					bind:value={player.name}
					use:autofocus
					onblur={() => finishEdit()}
					enterkeyhint="done"
				/>
			</form>
		{:else}
			<span class="name">{player.name}</span>
		{/if}
		<div class="actions" hidden={index === -1}>
			{#if !isEditing}
				<button tabindex="0" class="discrete-button" onclick={startEdit}>
					<span class="material-symbols-outlined">edit</span>
				</button>
			{:else}
				<button tabindex="0" class="discrete-button" onclick={finishEdit}>
					<span class="material-symbols-outlined">check</span>
				</button>
			{/if}
			<button class="discrete-button" tabindex="0" onclick={ondelete}>
				<span class="material-symbols-outlined">delete</span>
			</button>
		</div>
		<!-- <span class="control-indicator">ALT+{name === 'Bank' ? 'B' : index + 1}</span> -->
	</div>
	<div class="balance" style:color={player.balance > 0 ? 'lightgreen' : 'red'}>
		{new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(player.balance)}
	</div>
</div>

<style scoped>
	.player-panel {
		all: unset; /* Reset button styles */
		position: relative;
		box-sizing: border-box;
		cursor: pointer;
		width: 48%;
		background-color: var(--surface-color);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: 2px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 15px 10px;
		transition:
			transform 0.2s cubic-bezier(0, 0.96, 0.73, 1.01),
			box-shadow 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		min-height: 120px;
		overflow: hidden;
	}

	.player-panel:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 5px;
		height: 100%;
		background-color: var(--player-color);
	}
	.player-panel:focus,
	.player-panel.focused,
	.player-panel:active {
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
		border-color: var(--player-color);
		transform: scale(0.95);
		background-color: #333;
	}
	.player-panel:focus {
		outline: 1px solid var(--primary-text-color);
		outline-offset: 1px;
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 3px;
	}

	.name-form {
		flex: 1;
		min-width: 0;
	}

	.name,
	input.name {
		font-family: var(--font-heading);
		font-size: 0.6em;
		color: var(--primary-text-color);
		text-shadow: 2px 2px 0px #000;
		white-space: nowrap;
		overflow: hidden;
		flex: 1;
		text-overflow: ellipsis;
	}

	input.name {
		background: transparent;
		border: none;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 2px solid var(--primary-text-color);
		padding: 0;
		border-radius: 0;
	}
	.material-symbols-outlined {
		font-size: 1em;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		&[hidden] {
			display: none;
		}
	}

	.discrete-button {
		all: unset;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		&:after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			padding: 5px;
			background-color: #fff4;
			border-radius: 50%;
			opacity: 0;
			transition: opacity 0.2s ease;
		}
		&:hover:after,
		&:focus:after {
			opacity: 1;
		}
	}

	.balance {
		color: var(--primary-text-color);
		font-weight: bold;
		font-size: 2.5em;
		text-align: right;
		font-family: var(--font-body);
		letter-spacing: 1px;
	}
</style>
