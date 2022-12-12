import { Card, Values, Suits, from } from '../../src/model/card/Card'

describe('My Card', ()=>{
    let cardOne: Card

    beforeAll(()=>{
        cardOne = from("King", Suits.COINS, Values.KING);
    })

    test('getName', ()=>{
        expect(cardOne.name).toEqual("King");
    })

    test('getValue', ()=>{
        expect(cardOne.value).toEqual(0.5);
    })

    test('card precedences', ()=>{
        let cardTwo = from("Seven", Suits.CLUBS, Values.SEVEN);
        expect(cardTwo.value).toBeGreaterThan(cardOne.value);
    })

    test('getSuit', ()=>{
        expect(cardOne.suit).toEqual(Suits.COINS);
    })
})