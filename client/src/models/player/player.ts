import {Card} from "../cards/card";
import {Role} from "./role";

export class Player {
    private _username: String;
    private _role: Role;
    private _hand: [Card];
    private _moneyAmount: number;

    constructor(u: String, r:Role, h: [Card], m: number) {
        this._username = u;
        this._role = r;
        this._hand = h;
        this._moneyAmount = m;
    }

    public get username(){
        return this._username;
    }

    public set username(s:String){
        this._username = s;
    }

    public get role(){
        return this._role;
    }

    public set role(r:Role){
        this._role = r;
    }

    public get hand(){
        return this._hand;
    }

    public set hand(h){
        this._hand = h;
    }

    public get moneyAmount(){
        return this._moneyAmount;
    }

    public set moneyAmount(m:number){
        this._moneyAmount = m;
    }
}