import { Card } from '../../src/model/card/Card'
import { SetteMezzoCard, SetteMezzoValue, BriscolaSuits } from '../../src/model/card/SetteMezzoCard'

describe('My Card', ()=>{
    let cardOne: Card

    beforeAll(()=>{
        cardOne = new SetteMezzoCard("King", SetteMezzoValue.KING, BriscolaSuits.COINS);
    })

    test('getName', ()=>{
        expect(cardOne.getName()).toEqual("King");
    })

    test('getValue', ()=>{
        expect(cardOne.getCardValue()).toEqual(0.5);
    })

    test('card precedences', ()=>{
        let cardTwo = new SetteMezzoCard("Seven", SetteMezzoValue.SEVEN, BriscolaSuits.CLUBS);
        expect(cardTwo.getCardValue()).toBeGreaterThan(cardOne.getCardValue());
    })

    test('getSuit', ()=>{
        expect(cardOne.getSuit()).toEqual("Coins");
    })
})