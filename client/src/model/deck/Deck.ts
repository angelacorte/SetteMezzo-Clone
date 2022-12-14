import { Card, from, Values, Suits, nameOf } from "../card/Card";

export type Deck = Array<Card>

export function getCardWithName(deck: Deck, name: string): Card {
    let found = deck.filter(value =>
        nameOf(value) == name)
        .pop();
    if(!found) throw new Error('Card not found')
    return found
}

export function isEmpty(deck: Deck): Boolean {
    return deck.length == 0
}