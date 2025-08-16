export enum TransactionType {
	BUY = 'Achat',
	RENT = 'Loyer',
	TAX = 'Taxe',
	PARKING = 'Parking Gratuit',
	COMMUNITY = 'Caisse de communauté',
	CHANCE = 'Chance',
	SQUARE_ONE = 'Case départ',
	OTHER = 'Autre'
}

export interface Player {
	id: number;
	name: string;

	balance: number;
}

export interface Transaction {
	type: TransactionType;
	payer: number;
	recipient: number;
	amount: number;
}

export interface State {
	players: Player[];
	transactions: Transaction[];
	selectedPayer: number | null;
	selectedRecipient: number | null;
}
