import { Card, Values, Suits } from '../../src/model/card/Card';
import { Deck, createDeck, shuffle, draw , emptyDeck, removeCard, getCardWithName} from '../../src/model/deck/Deck';

describe('My deck', ()=>{
    let deck: Deck;

    beforeEach(()=>{
        deck = createDeck();
    })

    test('draw card', ()=>{
        let myCard = draw(deck);
        expect(myCard.value).toBeDefined();
    })

    test('draw on empty deck throws error', ()=>{
        expect(()=>draw(emptyDeck())).toThrowError('Empty deck')
    })

    test('has 40 cards', ()=>{
        expect(deck.cards.length).toEqual(40);
    })

    test('remove card', ()=>{
        let card = draw(deck)
        let deck2 = createDeck();
        deck2 = removeCard(deck2, card);
        expect(deck2.cards.length).toEqual(39);
    })

    test('there is King of swords', ()=>{
        let king = getCardWithName(deck, 'KING of SWORDS');
        expect(king.value).toEqual(0.5)
        expect(king.suit).toEqual(Suits.SWORDS)
    })
})