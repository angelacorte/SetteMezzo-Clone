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

export const VALUE_MAP: Map<string, number> = new Map([
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