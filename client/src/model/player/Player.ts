import { Card } from "../card/Card"

export interface Player {
    readonly id: string
    readonly name: string
    readonly moneyLeft: Number
    readonly hand: Hand
    readonly bets: Bets
}

export type Hand = Array<Card>
export type Bets = Array<Number>

export function newPlayer(id: string, name: string, moneyLeft: Number): Player {
    return createPlayer(id, name, moneyLeft, new Array<Card>(), new Array<Number>())
}

export function createPlayer(id: string, name: string, moneyLeft: Number, hand: Hand, bets: Bets) {
    return { id: id, name: name, moneyLeft: moneyLeft, hand: hand, bets: bets }
}

export function giveCard(player: Player, card: Card): Player {
    const newHand = player.hand
    newHand.push(card)
    return createPlayer(player.id, player.name, player.moneyLeft, newHand, player.bets)
}