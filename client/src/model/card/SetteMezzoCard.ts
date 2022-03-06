import { Card } from "./Card";

/**
 * Common card values for the SetteMezzo game.
 */
export enum SetteMezzoValue{
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

/**
 * Common card values for Briscola cards.
 */
export enum BriscolaSuits{
    SWORDS = "Swords",
    CUPS = "Cups",
    COINS = "Coins",
    CLUBS = "Clubs"
}

/**
 * A typical SetteMezzo card that has a {@link SetteMezzoValue} and 
 * a {@link BriscolaSuits}.
 */
export class SetteMezzoCard implements Card {
    private name: string;
    private value: SetteMezzoValue;
    private suit: BriscolaSuits;

    constructor(name: string, value: SetteMezzoValue, suit: BriscolaSuits){
        this.name = name;
        this.value = value;
        this.suit = suit;
    }

    getName(): string {
        return this.name;
    }

    getCardValue(): number {
        return this.value;
    }
    
    getSuit(): string {
        return this.suit;
    }
    
}