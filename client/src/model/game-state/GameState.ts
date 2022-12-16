import { Card } from "../card/Card";
import { createSetteMezzoDeck, Deck } from "../deck/Deck";
import { Player } from "../player/Player";

export interface GameState {
    readonly deck: Deck

    readonly players: Array<Player>
}

export function createGameState(deck: Deck, players: Array<Player>): GameState {
    return { deck: deck, players: players}
}

export function newGame(): GameState {
    return createGameState(new Array<Card>(), new Array<Player>())
}

export function newSetteMezzoGame(): GameState {
    return updateDeck(newGame(), createSetteMezzoDeck())
}

export function updateDeck(gameState: GameState, deck: Deck): GameState {
    return createGameState(deck, gameState.players)
}

export function addPlayer(state: GameState, player: Player): GameState {
    const newPlayers = state.players
    newPlayers.push(player)
    return createGameState(state.deck, newPlayers)
}