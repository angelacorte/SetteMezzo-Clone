import { BriscolaSuits, SetteMezzoCard, SetteMezzoValue } from "../card/SetteMezzoCard";
import { Deck, DeckImpl } from "./Deck";

export interface DeckFactory {
    createDeck(): Deck;
}

export class SetteMezzoDeckFactory implements DeckFactory {
    createDeck(): Deck {
        let deck = new DeckImpl;
        for(let suit in BriscolaSuits){
            for(let v in SetteMezzoValue){
                let value = SetteMezzoCard.valueMap.get(v);
                if(value){
                    deck.addCard(new SetteMezzoCard(v, value, suit))
                }
            }
        }
        return deck;
    }
}