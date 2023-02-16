/**
 * A card is an entity which has a suit and a value.
 */
export interface Card  {
    readonly suit: string
    readonly value: string
}

/**
 * Lists all the possible card suits.
 */
export enum Suits {
    SWORDS = "SWORDS",
    CUPS = "CUPS",
    COINS = "COINS",
    CLUBS = "CLUBS"
}

/**
 * Lists all the possible card values. Values go froom Ace to King
 */
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

/**
 * Maps every value string to a numeric value.
 */
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