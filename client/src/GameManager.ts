import { Card } from './model/card/Card';
import { Deck } from './model/deck/Deck';
import { GameState } from './model/game-state/GameState';
import { Player } from './model/Player';

/**
 * Manages the game state and client communication.
 */
export interface GameManager {
    /**
     * @returns all the players in play.
     */
    getPlayers(): Map<string, Player>;

    /**
     * 
     * @param playerId The player id.
     * @throws Player not found error.
     */
    getPlayer(playerId: string): Player;

    /**
     * Registers a player in the Game State.
     * @param player The player to register.
     * @throws Player not found error.
     * @throws Not enough money error.
     */
    registerPlayer(player: Player): void;

    /**
     * @returns All the bets made by the player.
     * @param playerId The player id.
     */
    getPlayerBets(playerId: string): Array<number>;

    /**
     * Registers a bet from a player, decreasing his money amount accordingly.
     * @param playerId The player id.
     * @param amount The amount of money to bet.
     */
    registerBet(playerId: string, amount: number): void;

    /**
     * Draws a card from the {@link Deck} and assigns it to the player.
     * @param playerId The player id.
     */
    drawCard(playerId: string): Card;

    /**
     * @returns All the cards assigned to the player.
     * @param playerId The player id.
     */
    getPlayerCards(playerId: string): Array<Card>;

    removeCardFromDeck(card: Card): void;

    getDeck(): Deck;
}

export class GameManagerImpl implements GameManager {
    private gameState: GameState;

    constructor(gameState: GameState){
        this.gameState = gameState;
    }

    getPlayer(playerId: string): Player {
        let player = this.gameState.getPlayers().get(playerId);
        if(!player) throw new Error("Player not found");
        return player;
    }

    getPlayers(): Map<string, Player> {
        return this.gameState.getPlayers();
    }

    registerPlayer(player: Player): void {
        this.gameState.getPlayers().set(player.getId(), player);
        this.gameState.getBets().set(player.getId(), new Array<number>())
        this.gameState.getTable().set(player.getId(), new Array<Card>());
    }

    getPlayerBets(playerId: string): Array<number> {
        let playerBets = this.gameState.getBets().get(playerId);
        if(!playerBets) throw new Error('Player not found.');
        return playerBets;
    }

    registerBet(playerId: string, amount: number): void {
        let player = this.getPlayer(playerId);
        player.removeMoney(amount);
        let playerBets = this.getPlayerBets(playerId);
        playerBets.push(amount);
    }

    drawCard(playerId: string): Card {
        let card = this.gameState.getDeck().draw();
        let playerCards = this.getPlayerCards(playerId);
        playerCards.push(card);
        this.removeCardFromDeck(card);
        return card;
    }

    getPlayerCards(playerId: string): Array<Card> {
        let playerCards = this.gameState.getTable().get(playerId);
        if(!playerCards) throw new Error('Player not found.');
        return playerCards;
    }

    removeCardFromDeck(card: Card): void {
        this.gameState.getDeck().removeCard(card);
    }

    getDeck(): Deck {
        return this.gameState.getDeck();
    }
}