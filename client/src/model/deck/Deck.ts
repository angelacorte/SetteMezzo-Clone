import ListPrompt from "inquirer/lib/prompts/list";
import { Card } from "../card/Card";

export interface Deck {
    shuffle(): void;
    getList(): Card[];
    draw(): Card;
    addCard(card: Card): void;
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

    isEmpty() {
        return this.cards.length == 0;
    }
}