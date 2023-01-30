import {Card} from "../card/Card";

export interface Player {
    readonly id: string
    readonly name: string
    readonly hand: Hand
}

export type Hand = Array<Card>