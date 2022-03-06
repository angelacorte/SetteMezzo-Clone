export enum CardValue {
    ACE = 1,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    JACK,
    KNIGHT,
    KING
}

export enum CardSuit {
    SWORDS,
    CUPS,
    COINS,
    CLUBS
}

/**
 * An immutable Card that has a {@link CardValue}
 * and a {@link CardSuit}.
 */
export interface Card {
    readonly value: CardValue;
    readonly suit: CardSuit;
}