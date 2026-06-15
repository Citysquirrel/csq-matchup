export interface Ability {
	name: string;
	isHidden: boolean;
}
export interface Pokemon {
	id: number;
	name: string;
	eng_name?: string;
	types: string[];
	speed: number;
	abilities: Ability[];
}
export interface Move {
	id: string;
	name: string;
	type: string;
}
export interface AllyPokemon extends Pokemon {
	moves: (Move | null)[];
}
export interface PartyPreset {
	id: string;
	name: string;
	allies: (AllyPokemon | null)[];
}
