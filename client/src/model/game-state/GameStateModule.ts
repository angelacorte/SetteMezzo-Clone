import {createSetteMezzoDeck, shuffle} from "../deck/DeckModule"
import {Deck} from "../../../../common/deck/Deck";
import {Player} from "../../../../common/player/Player";
import {GameState} from "../../../../common/game-state/GameState";
import {Card} from "../../../../common/card/Card";

/**
 * Factory for a Game State
 * @param deck The deck
 * @param players The players that joined the game
 * @returns The game state
 */
export function createGameState(deck: Deck, players: Array<Player>): GameState {
    return { deck: deck, players: players}
}

/**
 * Creates a new Game which isn't still started
 * @returns The game with an empty deck and no players joined.
 */
export function newGame(): GameState {
    return createGameState(new Array<Card>(), new Array<Player>())
}

/**
 * Creates a new GameState for a SetteMezzo match
 * @returns The GameState with a settemezzo deck and no players joined
 */
export function newSetteMezzoGame(): GameState {
    return updateDeck(newGame(), shuffle(createSetteMezzoDeck()))
}

/**
 * Updates the GameState deck
 * @param gameState The old GameState
 * @param deck the new Deck
 * @returns A new GameState with the new Deck
 */
export function updateDeck(gameState: GameState, deck: Deck): GameState {
    return createGameState(deck, gameState.players)
}

/**
 * Registers a new player in the game state
 * @param state The old game state
 * @param player The player to register
 * @returns A new gamestate in which the player is present
 */
export function addPlayer(state: GameState, player: Player): GameState {
    const newPlayers = state.players
    newPlayers.push(player)
    return createGameState(state.deck, newPlayers)
}

/**
 * Removes a player from the game state
 * @param state The old game state
 * @param playerId The player to remove from the game
 * @returns A new game state without the given player
 */
export function removePlayer(state: GameState, playerId: string): GameState {
    const newPlayers = state.players.filter(p => p.id != playerId)
    return createGameState(state.deck, newPlayers)
}

/**
 * Adds multiple players to the game state
 * @param state The old state
 * @param players The players to add
 * @returns A new Game State in which the given players are present
 */
export function addPlayers(state: GameState, players: Array<Player>): GameState {
    const newPlayers = state.players
    newPlayers.push(...players)
    return createGameState(state.deck, newPlayers)
}

/**
 * Modifies a player in the game state
 * @param state 
 * @param oldPlayer 
 * @param newPlayer 
 * @returns 
 */
export function updatePlayer(state: GameState, oldPlayer: Player, newPlayer: Player): GameState {
    const newPlayers = state.players.map(p => {
        if(p.id == oldPlayer.id) {
            return newPlayer
        } else {
            return p
        }
    })
    return createGameState(state.deck, newPlayers)
}

export function getPlayer(state: GameState, playerId: string) {
    const found = state.players.find(p => p.id == playerId)
    if(found) {
        return found
    } else throw new Error('Player not found')
}