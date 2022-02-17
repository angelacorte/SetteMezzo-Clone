import {Card} from "../cards/card";
import {Player} from "../player/player";

export class Round {
    id: number;
    table: [Card];
    bets: Map<Player, number>;

    constructor(id:number, t: [Card], b: Map<Player, number>) {
        this.id = id;
        this.table = t;
        this.bets = b;
    }
}