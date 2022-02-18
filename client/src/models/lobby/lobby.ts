import {Player} from "../player/player";
import {Card} from "../cards/card";
import {LobbyState} from "./lobbyState";

export class Lobby {
    private _id:String;
    private _players: [Player];
    private _deck: [Card];
    private _state: LobbyState;

    constructor(i:string, p: [Player], d: [Card], s: LobbyState) {
        this._id = i;
        this._players = p;
        this._deck = d;
        this._state = s;
    }

    public get id(): String {
        return this._id;
    }

    public set id(i: String) {
        this._id = i;
    }

    public get players(): [Player] {
        return this._players;
    }

    public set players(players: [Player]) {
        this._players = players;
    }

    public get deck(): [Card] {
        return this._deck;
    }

    public set deck(cards: [Card]) {
        this._deck = cards;
    }

    public get state(): LobbyState {
        return this._state;
    }

    public set state(s: LobbyState) {
        this._state = s;
    }
}