import { from, nameOf, pointValueOf } from "../../src/model/card/CardModel"
import {Card, Suits, Values} from "../../../common/card/Card";


describe('Card tests', ()=>{
    let myCard : Card

    beforeAll(()=>{
        myCard = from(Suits.SWORDS, Values.KING)
    })

    test('Name of', ()=>{
        const cardName = nameOf(myCard)
        expect(cardName).toBe("KING of SWORDS")
    })

    test('Point value', ()=> {
        const cardValue = pointValueOf(myCard)
        expect(cardValue).toBe(0.5)
    })
})