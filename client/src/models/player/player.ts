import {Card} from "../cards/card";
import {Role} from "./role";

export class Player {
    username: String;
    role: Role;
    hand: [Card];
    moneyAmount: number;

    constructor(u: String, r:Role, h:any, m: number) {
        this.username = u;
        this.role = r;
        this.hand = h;
        this.moneyAmount = m;
    }
}