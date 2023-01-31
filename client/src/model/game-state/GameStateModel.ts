import {createSetteMezzoDeck, shuffle} from "../deck/DeckModel"
import {Deck} from "../../../../common/deck/Deck";
import {Player} from "../../../../common/player/Player";
import {GameState} from "../../../../common/game-state/GameState";
import {Card} from "../../../../common/card/Card";


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

export function addPlayers(state: GameState, players: Array<Player>): GameState {
    const newPlayers = state.players
    newPlayers.push(...players)
    return createGameState(state.deck, newPlayers)
}

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