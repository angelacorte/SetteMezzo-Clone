import {Card, VALUE_MAP} from "../../../../common/card/Card";

/**
 * Factory for a Card.
 * @param suit The card's suit
 * @param value The card's string value
 * @returns The given Card
 */
export function from(suit: string, value: string): Card {
    return {suit: suit, value: value}
}

/**
 * Returns a string representation of the given Card.
 * @param card The card to represent via String
 * @returns The string representing the given card.
 */
export function nameOf(card: Card): string {
    return `${card.value} of ${card.suit}`
}

/**
 * Returns the numeric value of the given card
 * @param card The card
 * @returns The numeric value of the card
 */
export function pointValueOf(card: Card): number {
    let value = VALUE_MAP.get(card.value)
    if(value){
        return value
    } else {
        throw new Error('Value not valid')
    }
}