import {Hand, Player} from "../../../../common/player/Player";
import {Card} from "../../../../common/card/Card";


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