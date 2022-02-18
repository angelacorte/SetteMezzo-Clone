import {Card} from "../cards/card";
import {Player} from "../player/player";

export class Round {
    private _id: number;
    private _table: [Card];
    private _bets: Map<Player, number>;

    constructor(id:number, t: [Card], b: Map<Player, number>) {
        this._id = id;
        this._table = t;
        this._bets = b;
    }

    public get id(){
        return this._id;
    }

    public set id(i:number){
        this._id = i;
    }

    public get table(){
        return this._table;
    }

    public set table(cards){
        this._table = cards;
    }

    public get bets(){
        return this._bets;
    }

    public set bets(b){
        this._bets = b;
    }
}