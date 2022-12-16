import { createSetteMezzoDeck, Deck, emptyDeck, getCardWithName, isEmpty } from "../../src/model/deck/Deck"

describe('My deck', ()=>{
    const SETTE_MEZZO_DECK_SIZE = 40
    let deck: Deck

    beforeEach(()=>{
        deck = emptyDeck()
    })

    test('The basic factory creates an empty deck', ()=>{
        expect(isEmpty(deck)).toBeTruthy
    })

    test('A SetteMezzo deck has 40 starting cards', ()=>{
        deck = createSetteMezzoDeck()
        expect(deck.length).toBe(SETTE_MEZZO_DECK_SIZE)
    })

    test('Get card', ()=>{
        deck = createSetteMezzoDeck()
        expect(getCardWithName(deck, "KING of CLUBS")).not.toThrowError
    })
})