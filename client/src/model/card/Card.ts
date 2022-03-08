/**
 * A Card has a name, a value and a suit.
 * 
 */
export interface Card {
    /**
     * @returns the card's name.
     */
    getName(): string;

    /**
     * @returns the card's value.
     */
    getCardValue(): number;

    /**
     * @returns the card's suit.
     */
    getSuit(): string;
}