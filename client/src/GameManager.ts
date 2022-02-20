import { Client } from './Client'

/**
 * Represents the state of the game, cards in play, turn order, players playing and their money.
 *
 */
export interface GameState {
    /** @todo GameState model and architecture*/
}

/**
 * Manages the game state.
 */
export interface GameManager {
    /** @todo GameManager model and architecture*/
}

/**
 * Handles {@link GameState} management and delegates client-server communication to a {@link Client} object.
 */
export class GameManagerImpl implements GameManager {
    /**
     * A Client instance is delegated to perform client-server communication.
     */
    private client: Client

    /**
     * A current instance of the game state.
     */
    private gameState: GameState;

    constructor(client: Client){
        this.client = client;
        this.gameState = new class implements GameState {}
    }
    
}