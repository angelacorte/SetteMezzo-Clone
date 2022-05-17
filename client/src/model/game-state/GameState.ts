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
    getPlayers(): Array<Player>

    /**
     * @returns The cards each player got in every turn.
     */
    getPlayerCards(): Map<string, Array<Card>>

    /**
     * @returns The bets of all players.
     */
    getBets(): Map<string, Array<number>>;
 }

export class GameStateImpl implements GameState {
    private deck: Deck;
    private players: Array<Player>;
    private playerCards: Map<string, Array<Card>>;
    private bets: Map<string, Array<number>>;

    constructor(deck: Deck, players: Array<Player>, bets: Map<string, Array<number>>, playerCards: Map<string, Card[]>){
        this.deck = deck;
        this.players = players;
        this.bets = bets;
        this.playerCards = playerCards;
    }

    getDeck(): Deck {
        return this.deck;
    }

    getPlayers(): Array<Player> {
        return this.players;
    }

    getPlayerCards(): Map<string, Array<Card>> {
        return this.playerCards;
    }

    getBets(): Map<string, Array<number>> {
        return this.bets;
    }
    
}