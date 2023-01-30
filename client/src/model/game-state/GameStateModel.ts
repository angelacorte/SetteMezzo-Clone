import {Card} from "@common/card/Card"
import {createSetteMezzoDeck, shuffle} from "../deck/DeckModel";
import {Player} from "@common/player/Player";
import {Deck} from "@common/deck/Deck";
import {GameState} from "@common/game-state/GameState";
export function createGameState(deck: Deck, players: Array<Player>): GameState {
    return { deck: deck, players: players}
}

export function newGame(): GameState {
    return createGameState(new Array<Card>(), new Array<Player>())
}

export function newSetteMezzoGame(): GameState {
    return updateDeck(newGame(), shuffle(createSetteMezzoDeck()))
}

export function updateDeck(gameState: GameState, deck: Deck): GameState {
    return createGameState(deck, gameState.players)
}

export function addPlayer(state: GameState, player: Player): GameState {
    const newPlayers = state.players
    newPlayers.push(player)
    return createGameState(state.deck, newPlayers)
}