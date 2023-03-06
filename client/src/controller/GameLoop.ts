import { switchMap, map, Observable } from 'rxjs'
import { GameState } from '../../../common/game-state/GameState'
import { Player } from '../../../common/player/Player'
import {START_VALUE, MAX_VALUE} from '../global'
import { pointValueOf } from '../model/card/CardModule'
import { getPlayer, updatePlayer } from '../model/game-state/GameStateModule'
import { setPoints } from '../model/player/PlayerModule'
import {client} from './Client'
import {player} from './StartMenu'
import * as stio from './stio'
import {Card} from "../../../common/card/Card";
import {updateDeck} from "../model/game-state/GameStateModule";
import {createSetteMezzoDeck, shuffle} from "../model/deck/DeckModule";

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

const clientFailure = nextround
    .pipe(
        switchMap(({player$, gstate, currentP, currentR, maxR}) => 
            client.eventObservable('client-failed-in-game')
                .pipe(
                    map((userId) => ({userId, gstate}))
                )
        )
    )

showCard.subscribe(async ({card, opponent}) => {
    console.log(`${opponent.name} draw another card: ${card.value} of ${card.suit}`)
})

clientFailure.subscribe(({userId, gstate}) => {
    handleClientFailure(userId, gstate)
})

nextround.subscribe(async ({player$, gstate, currentP, currentR, maxR}) => {
    if(currentP == gstate.players.length) {
        checkRoundWinners(gstate)
        currentP = 0
        currentR += 1
        gstate = resetState(gstate)
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

function handleClientFailure(userId: string, gstate: GameState) {
    try {
        const playerFailed = getPlayer(gstate, userId)
        console.log(`Player ${playerFailed.name} disconnected from the game! Ending the game now...`)
        checkGameWinners(gstate)
    } catch(err) {
        // not handling failures here
    }
}

async function askCards(gstate: GameState, player: Player, totalValue: number): Promise<{newState: GameState, handValue: number}> {
    const card = gstate.deck.pop()
    if(card == undefined) {
        return Promise.reject('Deck is empty!')
    }
    console.log(`You draw ${card.value} of ${card.suit}`)
    const handValue = totalValue + pointValueOf(card)
    if(totalValue > START_VALUE){
        client.sendEvent("card-drawn", {card: card, player: player})
    }
    console.log(`Your hand is worth ${handValue} points`)
    if(handValue <= MAX_VALUE) {
        const choice = await stio.askConfirmation('Another card?')
        if(choice) {
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

function resetState(gstate: GameState): GameState {
    gstate.players.forEach((p) => p.points = START_VALUE)
    return updateDeck(gstate, shuffle(createSetteMezzoDeck()))
}