import { Player } from "../../../common/player/Player"
import { newPlayer, setPoints } from "../../src/model/player/PlayerModel"

describe('My player', ()=> {
    let player : Player
    
    beforeAll(()=>{
        player = newPlayer('0', 'Micio')
    })

    test('Player is created correctly', () => {
        expect(player.name + ' ' + player.id).toBe('Micio 0')
        expect(player.points).toEqual(0)
        expect(player.wins).toEqual(0)
    })

    test('Add points', ()=>{
        const player1 = setPoints(player, 10)
        expect(player1.points).toEqual(10)
    })
})