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
    getPlayers(): Array<Player>;

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
     * Draws a card from the {@link Deck} and assigns it to the player.
     * @param playerId The player id.
     */
    drawCard(playerId: string): Card;

    /**
     * @returns All the cards assigned to the player.
     * @param playerId The player id.
     */
    getPlayerCards(playerId: string): Array<Card>;

    /**
     * Adds the card to the player cards.
     * @param playerId The player id.
     * @param card The card to add.
     */
    updatePlayerCards(playerId: string, card: Card): void;

    /**
     * @returns the Deck;
     */
    getDeck(): Deck;
}

export class GameManagerImpl implements GameManager {
    private gameState: GameState;

    constructor(gameState: GameState){
        this.gameState = gameState;
    }

    getPlayer(playerId: string): Player {
        let player = this.gameState.getPlayers().filter((player) => player.getId() == playerId).pop();
        if(!player) throw new Error("Player not found");
        return player;
    }

    getPlayers(): Array<Player> {
        return this.gameState.getPlayers();
    }

    registerPlayer(player: Player): void {
        this.gameState.getPlayers().push(player);
        this.gameState.getPlayerCards().set(player.getId(), new Array<Card>());
    }

    drawCard(playerId: string): Card {
        let card = this.gameState.getDeck().draw();
        this.updatePlayerCards(playerId, card);
        return card;
    }

    getPlayerCards(playerId: string): Array<Card> {
        let playerCards = this.gameState.getPlayerCards().get(playerId);
        if(!playerCards) throw new Error('Player not found.');
        return playerCards;
    }

    updatePlayerCards(playerId: string, card: Card) {
        this.gameState.getDeck().removeCard(card);
        this.gameState.getPlayerCards().get(playerId)?.push(card);
    }

    getDeck(): Deck {
        return this.gameState.getDeck();    
    }
}