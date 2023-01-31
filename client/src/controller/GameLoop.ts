import { switchMap, map } from 'rxjs'
import { GameState } from '../../../common/game-state/GameState'
import { Player } from '../../../common/player/Player'
import { MAX_VALUE } from '../global'
import { pointValueOf } from '../model/card/CardModel'
import {client} from './Client'
import {player} from './StartMenu'
import * as stio from './stio'

const nextround = player
    .pipe(
        switchMap(player$ =>
            client.eventObservable('round')
                .pipe(
                    map(({gstate, currentP, currentR, maxP}) => ({player$, gstate, currentP, currentR, maxP}))
                ) 
        )
    )

nextround.subscribe(console.log)

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