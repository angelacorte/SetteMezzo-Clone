import { switchMap, map, Observable } from 'rxjs'
import { GameState } from '../../../common/game-state/GameState'
import { Player } from '../../../common/player/Player'
import {START_VALUE, MAX_VALUE} from '../global'
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

const wonRound: Observable<{
    player$: Player,
    gstate: GameState,
    winners: Player[],
    round: number
}> = player.pipe(
    switchMap(player$ =>
        client.eventObservable("round-winner")
            .pipe(
                map(({gstate, winners, round}) => ({player$, gstate, winners, round}))
            )
    )
)

async function obtainWinner(gs:GameState, round: number) {
    let players: Player[] = gs.players.filter((p) => p.points <= MAX_VALUE && p.points > START_VALUE)
    players = players.sort((a, b) => checkWinner(a,b))
    console.log("player sorted ", players)
    let winners = players.filter((p) => p.points == players[0].points)
    console.log("winners ", winners)
    gs.players.forEach((p) => {
        if(winners.some((w) => w.id == p.id)) p.wins += 1
        client.sendEvent("won-round", {gameState: gs, winners: winners, round: round})
    })
    console.log("gs", gs.players)
}

function checkWinner(pl1: Player, pl2: Player): number{
    if(pl1.points > pl2.points) return -1
    if(pl1.points < pl2.points) return 1
    return 0 //means that pl1 is equal to pl2
}

async function resetPoints(gstate: GameState) {
    gstate.players.forEach((p) => p.points = START_VALUE)
}

nextround.subscribe(async ({player$, gstate, currentP, currentR, maxR}) => {
    if(currentP == gstate.players.length) {
        currentP = 0
        await obtainWinner(gstate, currentR)
        currentR += 1
        await resetPoints(gstate)
        if(currentR > maxR){
            client.sendEvent('end-game', gstate)
            return
        }
    }
    console.log("== ROUND #", currentR)
    console.log(`${gstate.players[currentP].name}'s turn`)
    if ( gstate.players[currentP].id == player$.id) {
        try {
            const g = await askCards(gstate, START_VALUE)
            gstate.players[currentP].points = g.handValue
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
        return Promise.reject('Deck is empty!')
    }
    console.log(`You draw ${card.value} of ${card.suit}`)
    const handValue = totalValue + pointValueOf(card)
    console.log(`Your hand values is ${handValue}`)
    if(handValue <= MAX_VALUE) {
        const choice = await stio.askChoice([`Another card`, 'Stop'])
        if(choice == `Another card`) {
            return await askCards(gstate, handValue)
        } else {
            return Promise.resolve(({gstate, handValue}))
        }
    } else {
        return Promise.reject(`Your hand value has exceeded max value.`)
    }
}

wonRound.subscribe(async ({gstate, winners, round}) => {
    let users: string[] = winners.map((w) => w.name)
    console.log(`ROUND ${round} HAS BEEN WON BY ${users}`)
})