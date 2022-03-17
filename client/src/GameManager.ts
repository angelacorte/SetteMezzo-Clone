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
     * All the bets made by players in the form of a map.
     */
    getBets(): Map<string, number>;

    /**
     * Registers a bet from a player, decreasing his money amount accordingly.
     * @param playerId 
     * @param amount 
     */
    registerBet(playerId: string, amount: number): void;
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
    }

    getBets(): Map<string, number> {
        return this.gameState.getBets();
    }

    registerBet(playerId: string, amount: number): void {
        let player = this.getPlayer(playerId);
        player.removeMoney(amount);
        let bets = this.gameState.getBets();
        bets.set(playerId, amount);
    }

}