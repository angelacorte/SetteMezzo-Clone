import { Card } from "../card/Card";
import { Deck } from "../deck/Deck";
import { Player } from "../Player";

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
     * @returns A map from player ids to players.
     */
    getPlayers(): Map<string, Player>

    /**
     * @returns The cards each player got in every turn.
     */
    getTable(): Map<string, Card[]>

    /**
     * @returns The bets of all players.
     */
    getBets(): Map<string, number>;
 }

export class GameStateImpl implements GameState {
    private deck: Deck;
    private players: Map<string, Player>;
    private table: Map<string, Card[]>;
    private bets: Map<string, number>;

    constructor(deck: Deck, players: Map<string, Player>, bets: Map<string, number>, table: Map<string, Card[]>){
        this.deck = deck;
        this.players = players;
        this.bets = bets;
        this.table = table;
    }

    getDeck(): Deck {
        return this.deck;
    }

    getPlayers(): Map<string, Player> {
        return this.players;
    }

    getTable(): Map<string, Card[]> {
        return this.table;
    }

    getBets(): Map<string, number> {
        return this.bets;
    }
    
}