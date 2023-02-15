import {Card, VALUE_MAP} from "../../../../common/card/Card";

export function from(suit: string, value: string): Card {
    return {suit: suit, value: value}
}

export function nameOf(card: Card): string {
    return `${card.value} of ${card.suit}`
}

export function pointValueOf(card: Card): number {
    let value = VALUE_MAP.get(card.value)
    if(value){
        return value
    } else {
        throw new Error('Value not valid')
    }
}