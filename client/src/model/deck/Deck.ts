import { Card, from, Values, Suits, valueMap } from "../card/Card";

export interface Deck {
    cards: Array<Card>
}

export function createDeck(): Deck {
    const cards = new Array<Card>()
    //add the 42 briscola cards...
    for(let suit in Suits){
        for(let v in Values){
            let value = valueMap.get(v);
            if(value){
                cards.push(from(`${v} of ${suit}`, suit, value))
            }
        }
    }
    return { cards: cards }
}

export function emptyDeck(): Deck {
    return {cards: new Array<Card>()}
}

export function shuffle(deck: Deck): Deck {
    return {cards: [...deck.cards]}
}

export function draw(deck: Deck): Card {
    let card = deck.cards.pop()
    if(!card){
        throw new Error('Empty deck');
    } else {
        return card;
    }
}

export function removeCard(deck: Deck, card: Card): Deck {
    const cards = deck.cards.filter(c => c.name != card.name);
    return {cards: cards}
}

export function getCardWithName(deck: Deck, name: string) {
    let found = deck.cards.filter(value =>
        value.name == name)
        .pop();
    if(!found) throw new Error('Card not found')
    return found
}

export function isEmpty(deck: Deck) {
    return deck.cards.length == 0
}