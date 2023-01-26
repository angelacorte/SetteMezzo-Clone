import { addPlayer, GameState, newGame, newSetteMezzoGame } from "../../src/model/game-state/GameState"
import { giveCard, newPlayer } from "../../src/model/player/Player"
import { Suits, Values } from "../../src/model/card/Card"


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

    test('Add Player', ()=>{
        const newState = addPlayer(gameState, myPlayer)
        expect(newState.players.length).toEqual(1)
    })
    
    test('Game State is serializable', ()=>{
        gameState = newSetteMezzoGame()
        const newPlayer = giveCard(myPlayer, {suit: Suits.CLUBS, value: Values.ACE})
        const toSerialize = addPlayer(gameState, newPlayer)
        const serializedState = JSON.stringify(toSerialize)
        const deserializedState: GameState = JSON.parse(serializedState)
        expect(toSerialize == deserializedState).toBeTruthy
    })

})