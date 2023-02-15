import {from, nameOf} from "../card/CardModule";
import {Deck} from "../../../../common/deck/Deck";
import {Card, Suits, Values} from "../../../../common/card/Card";

/**
 * Factory for a deck of cards to play SetteMezzo.
 * @returns A deck of 40 cards.
 */
export function createSetteMezzoDeck(): Deck {
    const cards = new Array<Card>()
    for(let suit in Suits){
        for(let value in Values){
            cards.push(from(suit, value))
        }
    }
    return cards
}

/**
 * Factory for an empty deck
 * @returns An empty deck
 */
export function emptyDeck(): Deck {
    return new Array<Card>()
}

/**
 * Fetches the given card from the deck
 * @param deck The deck from which to search for the card
 * @param name The card's name
 * @returns The card if present
 * @throws Card not found exception
 */
export function getCardWithName(deck: Deck, name: string): Card {
    let found = deck.filter(value =>
        nameOf(value) == name)
        .pop();
    if(!found) throw new Error('Card not found')
    return found
}

/**
 * Checks if the given deck is empty
 * @param deck 
 * @returns 
 */
export function isEmpty(deck: Deck): Boolean {
    return deck.length == 0
}

/**
 * Shuffles the deck, randomizing its elements
 * @param deck The deck to shuffle
 * @returns A new randomized deck
 */
export function shuffle(deck: Deck): Deck {
    return deck.sort((a, b) => 0.5 - Math.random());
}

