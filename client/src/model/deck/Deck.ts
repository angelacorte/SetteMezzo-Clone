import { Card } from "../card/Card";

/**
 * A generic deck of cards.
 */
export interface Deck {
    /**
     * Randomizes the cards in the deck.
     */
    shuffle(): void;

    /**
     * @returns an immutable copy of the cards in the deck.
     */
    getList(): Card[];

    /**
     * @returns pops the top card of the deck.
     */
    draw(): Card;

    /**
     * 
     * @param card The card to add.
     */
    addCard(card: Card): void;

    /**
     * 
     * @param card The card to remove.
     */
    removeCard(card: Card): void;

    /**
     * 
     * @param name The unique card name.
     * @returns The card with given name.
     */
    getCard(name: string): Card;

    /**
     * Checks if the deck is empty.
     */
    isEmpty(): boolean;
}

export class DeckImpl implements Deck {
    private cards: Card[];

    constructor(){
        this.cards = new Array<Card>();
    }
    
    shuffle() {
        this.cards.sort((a, b) => 0.5 - Math.random());
    }

    getList(): Card[] {
        return [...this.cards];
    }

    draw(): Card {
        let card = this.cards.pop();
        if(!card){
            throw new Error('Empty deck');
        } else {
            return card;
        }
    }

    addCard(card: Card): void {
        this.cards.push(card);
    }

    removeCard(card: Card) {
        this.cards = this.cards.filter(c => c.getName() != card.getName());
    }

    getCard(name: string): Card {
        let found = this.getList().filter(value =>
            value.getName() == name)
            .pop();
        if(!found) throw new Error('Card not found')
        return found
    }

    isEmpty() {
        return this.cards.length == 0;
    }
}