import { Card } from "../card/Card"

export interface Player {
    readonly id: string
    readonly name: string
    readonly hand: Hand
}

export type Hand = Array<Card>

export function newPlayer(id: string, name: string): Player {
    return createPlayer(id, name, new Array<Card>())
}

export function createPlayer(id: string, name: string, hand: Hand) {
    return { id: id, name: name, hand: hand}
}

export function giveCard(player: Player, card: Card): Player {
    const newHand = player.hand
    newHand.push(card)
    return createPlayer(player.id, player.name, newHand)
}