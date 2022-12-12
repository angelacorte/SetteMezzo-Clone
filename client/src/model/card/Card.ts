
export interface Card  {
    name: string
    suit: string
    value: number
}

export function from(name: string, suit: string, value: number): Card {
    return {name: name, suit: suit, value: value}
}

export enum Suits {
    SWORDS = "SWORDS",
    CUPS = "CUPS",
    COINS = "COINS",
    CLUBS = "CLUBS"
}

export enum Values {
    ACE = 1,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    JACK = 0.5,
    KNIGHT = 0.5,
    KING = 0.5
}

export const valueMap: Map<string, number> = new Map([
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