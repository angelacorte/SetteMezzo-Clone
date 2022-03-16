import { Deck } from "./deck/Deck";
import { Player } from "./Player";

/**
 * Represents the state of the game, cards in play, turn order, players playing and their money.
 *
 */
 export interface GameState {
    /**
     * @returns The deck used to play.
     */
    getDeck(): Deck;

    /**
     * @returns A list of all players in play.
     */
    getPlayers(): Player[];

    /**
     * @returns The bets of all players.
     */
    getBets(): Map<string, number>;
 }

export class GameStateImpl implements GameState {
    private deck: Deck;
    private players: Player[];
    private bets: Map<string, number>;

    constructor(deck: Deck, players: Player[], bets: Map<string, number>){
        this.deck = deck;
        this.players = players;
        this.bets = bets;
    }

    getDeck(): Deck {
        return this.deck;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getBets(): Map<string, number> {
        return this.bets;
    }
    
}