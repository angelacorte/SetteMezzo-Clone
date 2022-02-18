import {cardValue, getRandomValue} from "./cardValue";
import {cardSuit, getRandomSuit} from "./cardSuit";

export class Card {
    private _value: cardValue;
    private _suit: cardSuit;

    constructor(n:cardValue, s:cardSuit) {
        this._value = n;
        this._suit = s;
    }

    public get value() {
        return this._value;
    }

    public set value(v:cardValue) {
        this._value = v;
    }

    public get suit(){
        return this._suit;
    }

    public set suit(s:cardSuit){
        this._suit = s;
    }
}

export function getRandomCard(){
    return new Card(getRandomValue() ,getRandomSuit());
}