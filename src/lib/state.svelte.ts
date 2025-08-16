import type { State } from './types';

let nextId = 0;

const state = $state<State>({
	players: [
		{
			id: nextId++,
			name: 'Player 1',

			balance: 1500
		},
		{
			id: nextId++,
			name: 'Player 2',

			balance: 1500
		},
		{
			id: nextId++,
			name: 'Player 3',

			balance: 1500
		},
		{
			id: nextId++,
			name: 'Player 4',

			balance: 1500
		}
	],
	transactions: [],
	selectedPayer: null,
	selectedRecipient: null
});

export default state;
