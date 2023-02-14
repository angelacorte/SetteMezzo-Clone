import { addPlayer, addPlayers, newGame, newSetteMezzoGame, removePlayer, updatePlayer } from "../../src/model/game-state/GameStateModel"
import { newPlayer, setPoints } from "../../src/model/player/PlayerModel"

import {Suits, Values} from "../../../common/card/Card";
import {GameState} from "../../../common/game-state/GameState";

describe('Game State tests',() => {
    
    let gameState: GameState
    const myPlayer = newPlayer("0", "Pippo")

    beforeEach(()=>{
        gameState = newGame()
    })

    test('Game State is immutable', () => {
        expect(gameState.deck.push({suit: Suits.CLUBS, value: Values.ACE})).toThrowError
        expect(gameState.players.push(myPlayer)).toThrowError
    })

    test('Add and remove Player', ()=>{
        const newState = addPlayer(gameState, myPlayer)
        expect(newState.players.length).toEqual(1)
        const afterRemoval = removePlayer(gameState, myPlayer.id)
        expect(afterRemoval.players.length).toEqual(0)
    })

    test('Add multiple players', ()=>{
        const players = [newPlayer('0', 'Mahmood'), newPlayer('1', 'Blanco')]
        const newState = addPlayers(gameState, players)
        expect(newState.players.length).toEqual(2)
    })

    test('Drawing a card reduces deck size', ()=>{
        gameState = newSetteMezzoGame()
        gameState.deck.pop()
        expect(gameState.deck.length).toBe(39)
    })
    
    test('Update player', ()=> {
        const player = newPlayer('0', 'Mario Rossi')
        const withPlayer = addPlayer(gameState, player)
        const modifiedPlayer = setPoints(player, 10)
        let updatedPlayer = updatePlayer(withPlayer, player, modifiedPlayer)
        expect(updatedPlayer.players.pop()?.points).toEqual(10)

        //modifications to players that aren't in the game state doesn't affect it
        const nonPlaying = newPlayer('1', 'Franco Verdi')
        const updatedPlayer1 = updatePlayer(updatedPlayer, player, nonPlaying)
        expect(updatedPlayer1.players.find(p => p.id == nonPlaying.id)).toBeUndefined()
    })
})