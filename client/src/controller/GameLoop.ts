import { switchMap, map, Observable } from 'rxjs'
import { GameState } from '../../../common/game-state/GameState'
import { Player } from '../../../common/player/Player'
import {START_VALUE, MAX_VALUE} from '../global'
import { pointValueOf } from '../model/card/CardModel'
import { updatePlayer } from '../model/game-state/GameStateModel'
import { setPoints } from '../model/player/PlayerModel'
import {client} from './Client'
import {player} from './StartMenu'
import * as stio from './stio'
import {Card} from "../../../common/card/Card";

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

const showCard: Observable<{
    card: Card,
    opponent: Player
}> = client.eventObservable('show-card')

showCard.subscribe(async ({card, opponent}) => {
    console.log(`${opponent.name} draw another card: ${card.value} of ${card.suit}`)
})

nextround.subscribe(async ({player$, gstate, currentP, currentR, maxR}) => {
    if(currentP == gstate.players.length) {
        checkRoundWinners(gstate)
        currentP = 0
        currentR += 1
        resetPoints(gstate)
        if(currentR > maxR){
            checkGameWinners(gstate)
            return
        }
    }
    console.log("== ROUND #", currentR)
    const currentPlayer = gstate.players[currentP]
    console.log(`${currentPlayer.name}'s turn`)
    if (currentPlayer.id == player$.id) {
        try {
            const g = await askCards(gstate, currentPlayer, START_VALUE)
            client.sendEvent('next', {gameState: g.newState, currentPlayer: currentP+1, currentRound: currentR, maxRounds: maxR})
        } catch(err) {
            client.sendEvent('next', {gameState: gstate, currentPlayer: currentP+1, currentRound: currentR, maxRounds: maxR})
            console.log(err)
        }
    }
})

async function askCards(gstate: GameState, player: Player, totalValue: number): Promise<{newState: GameState, handValue: number}> {
    const card = gstate.deck.pop()
    if(card == undefined) {
        return Promise.reject('Deck is empty!')
    }
    console.log(`You draw ${card.value} of ${card.suit}`)
    const handValue = totalValue + pointValueOf(card)
    console.log("total val ", totalValue)
    if(totalValue > START_VALUE){
        client.sendEvent("card-drawn", {card: card, player: player})
    }
    console.log(`Your hand is worth ${handValue} points`)
    if(handValue <= MAX_VALUE) {
        const choice = await stio.askChoice([`Another card`, 'Stop'])
        if(choice == `Another card`) {
            return await askCards(gstate, player, handValue)
        } else {
            const newState = updatePlayer(gstate, player, setPoints(player, handValue))
            return Promise.resolve(({newState, handValue}))
        }
    } else {
        return Promise.reject(`Your hand value has exceeded max value.`)
    }
}

function checkRoundWinners(gs:GameState) {
    const winningValue = gs.players.map(p => p.points).reduce((acc, p) => {
        if(acc > p) { return acc } else { return p }
    }, 0)
    if(winningValue > 0){
        const winners = gs.players.filter(p => p.points == winningValue)
        winners.forEach(w => w.wins +=1 )
        console.log('== The round WINNERS are:')
        winners.forEach((w) => console.log(`- ${w.name} with ${w.points} points`))
    }else{
     console.log("Nobody won this round.")
    }
}

function checkGameWinners(gs: GameState) {
    const mostWins = gs.players.map(p => p.wins).reduce((acc, p) => {
        if(acc > p) { return acc } else { return p }
    }, 0)
    if(mostWins > 0){
        const winners = gs.players.filter(p => p.wins == mostWins)
        console.log('== The game WINNERS are:')
        winners.forEach((w) => console.log(`${w.name} with ${w.wins} wins`))
    }else{
        console.log("Nobody won the game.")
    }
}

function resetPoints(gstate: GameState) {
    gstate.players.forEach((p) => p.points = START_VALUE)
}