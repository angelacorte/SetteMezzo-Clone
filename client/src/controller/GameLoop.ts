import { switchMap, map, Observable } from 'rxjs'
import { GameState } from '../../../common/game-state/GameState'
import { Player } from '../../../common/player/Player'
import { MAX_VALUE } from '../global'
import { pointValueOf } from '../model/card/CardModel'
import {client} from './Client'
import {player} from './StartMenu'
import * as stio from './stio'

const nextround: Observable<{
    player$: Player
    gstate: GameState
    currentP: number
    currentR: number
    maxR: number
}> = player.pipe(
        switchMap(player$ =>
            client.eventObservable('round')
                .pipe(
                    map(({gstate, currentP, currentR, maxR}) => ({player$, gstate, currentP, currentR, maxR}))
                ) 
        )
    )


nextround.subscribe(async ({player$, gstate, currentP, currentR, maxR}) => {
    if(currentP == gstate.players.length) {
        currentP = 0
        currentR += 1
        if(currentR > maxR){
            client.sendEvent('end-game', gstate)
            return
        }
    }
    console.log("== ROUND #", currentR)
    console.log(`${gstate.players[currentP].name}'s turn`)
    if ( gstate.players[currentP].id == player$.id) {
        try {
            const g = await askCards(gstate, 0)
            client.sendEvent('next', {gameState: g.gstate, currentPlayer: currentP+1, currentRound: currentR, maxRounds: maxR})
        } catch(err) {
            client.sendEvent('next', {gameState: gstate, currentPlayer: currentP+1, currentRound: currentR, maxRounds: maxR})
            console.log(err)
        }
        
    }
})

async function askCards(gstate: GameState, totalValue: number): Promise<{gstate: GameState, handValue: number}> {
    const card = gstate.deck.pop()
    if(card == undefined) {
        return Promise.reject('Il mazzo è vuoto!')
    }
    console.log(`Hai pescato ${card.value} di ${card.suit}`)
    const handValue = totalValue + pointValueOf(card)
    console.log(`La tua mano vale ${handValue} punti`)
    if(handValue < MAX_VALUE) {
        const choice = await stio.askChoice([`Un'altra carta`, 'Stop'])
        if(choice == `Un'altra carta`) {
            return await askCards(gstate, handValue)
        } else {
            return Promise.resolve(({gstate, handValue}))
        }
    } else {
        return Promise.reject(`La tua mano ha superato il valore massimo`)
    }
}