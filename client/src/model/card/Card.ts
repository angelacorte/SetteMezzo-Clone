export interface Card  {
    readonly suit: string
    readonly value: string
}

export enum Suits {
    SWORDS = "SWORDS",
    CUPS = "CUPS",
    COINS = "COINS",
    CLUBS = "CLUBS"
}

export enum Values {
    ACE = "ACE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
    SIX = "SIX",
    SEVEN = "SEVEN",
    JACK = "JACK",
    KNIGHT = "KNIGHT",
    KING = "KING"
}

const VALUE_MAP: Map<string, number> = new Map([
    ["ACE", 1],
    ["TWO", 2],
    ["THREE", 3],
    ["FOUR", 4],
    ["FIVE", 5],
    ["SIX", 6],
    ["SEVEN", 7],
    ["JACK", 0.5],
    ["KNIGHT", 0.5],
    ["KING", 0.5],
])

export function from(suit: string, value: string): Card {
    return {suit: suit, value: value}
}

export function nameOf(card: Card): string {
    return `${card.value} of ${card.suit}`
}

export function pointValueOf(card: Card): number {
    let value = VALUE_MAP.get(card.value)
    if(value){
        return value
    } else {
        throw new Error('Value not valid')
    }
}