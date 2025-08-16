<script lang="ts">
	import PlayerDropdown from './PlayerDropdown.svelte';
	import appState from '$lib/state.svelte';
	import { TransactionType } from '$lib/types';
	import type { ChangeEventHandler } from 'svelte/elements';
	let amount = $state<number | null>(null);

	const registerTransaction = () => {
		console.log(amount);
		if (
			appState.selectedPayer === null ||
			appState.selectedRecipient === null ||
			!amount ||
			amount <= 0
		)
			return;
		appState.transactions.push({
			payer: appState.selectedPayer,
			recipient: appState.selectedRecipient,
			type: TransactionType.OTHER,
			amount
		});
		const payer = appState.players.find((p) => p.id === appState.selectedPayer);
		const recipient = appState.players.find((p) => p.id === appState.selectedRecipient);

		if (payer) payer.balance -= amount;
		if (recipient) recipient.balance += amount;

		amount = null;
		appState.selectedPayer = null;
		appState.selectedRecipient = null;
	};

	const handleAmountKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			registerTransaction();
		}
	};

	const preventNonDigtsInAmount: ChangeEventHandler<HTMLInputElement> = (e) => {
		const input = e.target as HTMLInputElement;
		input.value = input.value.replace(/[^0-9]/g, '');
	};

	const addToAmount = (amountToAdd: number) => {
		if (amount === null) amount = 0;
		amount += amountToAdd;
	};
</script>

<div class="editor-card pattern-stripes-diagonal">
	<h1>MonoMoney</h1>
	<h2>Transaction</h2>
	<div class="actors">
		<div class="actor-control">
			<label for="payer">From</label>
			<PlayerDropdown id="payer" bind:value={appState.selectedPayer} />
		</div>
		<span class="arrow">→</span>
		<div class="actor-control">
			<label for="recipient">To</label>
			<PlayerDropdown id="recipient" bind:value={appState.selectedRecipient} />
		</div>
	</div>

	<div class="amount-control">
		<label for="amount">Amount</label>
		<div class="input-group">
			<span class="currency-symbol">$</span>
			<input
				type="number"
				id="amount"
				min="0"
				max="1e10"
				pattern="[0-9]*"
				bind:value={amount}
				onkeydown={handleAmountKeyDown}
				oninput={preventNonDigtsInAmount}
				placeholder="Enter amount"
			/>
			<button onclick={registerTransaction}>Pay</button>
		</div>
		<div class="adders">
			<button onclick={() => addToAmount(50)}>+50</button>
			<button onclick={() => addToAmount(100)}>+100</button>
			<button onclick={() => addToAmount(500)}>+500</button>
			<button onclick={() => addToAmount(1000)}>+1000</button>
		</div>
	</div>
</div>

<style scoped>
	.editor-card {
		box-sizing: border-box;
		padding: 20px 5px;
		width: 100%;
		background-color: var(--surface-color);
	}

	h1 {
		text-align: center;
		font-size: 0.8em;
		color: var(--primary-text-color);
	}

	h2 {
		text-align: center;
		margin-top: 0;
		font-size: 1.5em;
	}

	.actors {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
		margin-bottom: 20px;
	}

	.actor-control {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.arrow {
		font-size: 2.5em;
		color: var(--accent-color);
		line-height: 1.5; /* Align with inputs */
	}

	label {
		font-family: var(--font-heading);
		font-size: 0.8em;
		margin-bottom: 5px;
		color: var(--secondary-text-color);
		text-transform: uppercase;
	}

	.amount-control {
		display: flex;
		flex-direction: column;
	}

	.input-group {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.currency-symbol {
		padding: 0 15px;
		font-size: 1.8em;
		color: var(--accent-color);
		background-color: var(--border-color);
		border-top-left-radius: var(--border-radius);
		border-bottom-left-radius: var(--border-radius);
		line-height: 45px; /* Match input height */
		border: 1px solid var(--border-color);
		border-right: none;
	}

	input {
		flex-grow: 1;
		border-radius: 0;
		font-size: 1.5em;
		border-width: 2px;
		&:focus {
			border-color: var(--accent-color);
			outline: none;
		}
	}

	.input-group button {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		height: 47px; /* Match input height + border */
		font-size: 1.2em;
	}

	/* Remove number input spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.adders {
		margin: 10px 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 10px;
	}
</style>
