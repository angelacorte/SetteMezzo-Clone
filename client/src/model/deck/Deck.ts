import { Card } from "../card/Card";

export interface Deck {
    shuffle(): void;
    getList(): Card[];
    draw(): Card;
    addCard(card: Card): void;
    removeCard(card: Card): void;
    getCard(name: string): Card;
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