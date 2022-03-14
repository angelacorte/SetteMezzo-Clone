import { Deck, DeckImpl } from '../../src/model/deck/Deck'
import { Card } from '../../src/model/card/Card';
import { SetteMezzoDeckFactory } from '../../src/model/deck/DeckFactory';
import { BriscolaSuits } from '../../src/model/card/SetteMezzoCard';

class MockCard implements Card {
    private value: number;

    constructor(value: number){
        this.value = value;
    }

    getName(): string {
        return "Mock card";
    }
    getCardValue(): number {
        return this.value;
    }
    getSuit(): string {
        return "Mocks";
    }
}

describe('My deck', ()=>{
    let deck: Deck;

    beforeEach(()=>{
        deck = new DeckImpl();
    })

    test('is created empty', ()=>{
        expect(deck.isEmpty()).toBeTruthy();
    })

    test('addCard', ()=>{
        deck.addCard(new MockCard(0));
        expect(deck.isEmpty()).toBeFalsy();
    })

    test('draw card', ()=>{
        const cardOne = new MockCard(1);
        const cardTwo = new MockCard(2);
        deck.addCard(cardOne);
        deck.addCard(cardTwo);
        let myCard: Card = deck.draw();
        expect(myCard.getCardValue()).toBe(2);
    })

    test('draw on empty deck throws error', ()=>{
        expect(()=>deck.draw()).toThrowError('Empty deck')
    })
})

describe('Settemezzo Deck', ()=>{
    let deck: Deck;

    beforeAll(()=>{
        deck = new SetteMezzoDeckFactory().createDeck();
    })

    test('has 40 cards', ()=>{
        expect(deck.getList().length).toEqual(40);
    })

    test('remove card', ()=>{
        let card = deck.draw()
        let deck2 = new SetteMezzoDeckFactory().createDeck();
        deck2.removeCard(card);
        expect(deck2.getList().length).toEqual(39);
    })

    test('there is King of swords', ()=>{
        let king = deck.getCard('KING of SWORDS');
        console.log(king)
        expect(king.getCardValue()).toEqual(0.5)
        expect(king.getSuit()).toEqual(BriscolaSuits.SWORDS)
    })
})