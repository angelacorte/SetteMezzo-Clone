import {cardValue, getRandomValue} from "./cardValue";
import {cardSuit, getRandomSuit} from "./cardSuit";

export class Card {
    value: cardValue;
    suit: cardSuit;

    constructor(n:cardValue, s:cardSuit) {
        this.value = n;
        this.suit = s;
    }
}

export function getRandomCard(){
    return new Card(getRandomValue() ,getRandomSuit());
}


