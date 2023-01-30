import { Card, Values, Suits } from "@common/card/Card";
import {from, nameOf} from "../card/CardModel";
import {Deck} from "@common/deck/Deck";

export function createSetteMezzoDeck(): Deck {
    const cards = new Array<Card>()
    for(let suit in Suits){
        for(let value in Values){
            cards.push(from(suit, value))
        }
    }
    return cards
}

export function emptyDeck(): Deck {
    return new Array<Card>()
}

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

export function shuffle(deck: Deck): Deck {
    return deck.sort((a, b) => 0.5 - Math.random());
}

