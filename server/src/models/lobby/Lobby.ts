/**
 * Enum with the states for a lobby
 */
import {LobbyUtils} from "../../utils/LobbyUtils";
import {inflate} from "zlib";

export enum LobbyState {
    CREATED,
    EMPTY,
    FULL,
    STARTED,
    DELETED
};

/**
 * Class Lobby represent all the infos that a lobby must have
 */
export class Lobby implements LobbyUtils{
    private _id: string;
    private _owner: string;
    private _players: string[];
    private _deck: any; //Cards[]
    private _state: LobbyState;
    private _open: boolean;
    private _maxParticipants: number;
    private _maxRounds: number;
    private _sbleuri: number;

    constructor(id:string, owner: string, players: string[], deck: any, state: LobbyState, open: boolean, maxP: number, maxR: number, sbleuri: number) {
        this._id = id;
        this._owner = owner;
        this._players = players;
        this._deck = deck;
        this._state = state;
        this._open = open;
        this._maxParticipants = maxP;
        this._maxRounds = maxR;
        this._sbleuri = sbleuri;
    }

    getId(): string {
        return this._id;
    }

    getOwner(): string {
        return this._owner;
    }

    setOwner(value: string) {
        this._owner = value;
    }

    getPlayers(): string[] {
        return this._players;
    }

    setPlayers(value: string[]) {
        this._players = value;
    }

    getDeck(): any {
        return this._deck;
    }

    setDeck(value: any) {
        this._deck = value;
    }

    getState(): LobbyState {
        return this._state;
    }

    setState(value: LobbyState) {
        this._state = value;
    }

    isOpen(): boolean {
        return this._open;
    }

    setOpen(value: boolean) {
        this._open = value;
    }

    getMaxParticipants(): number {
        return this._maxParticipants;
    }

    setMaxParticipants(value: number) {
        this._maxParticipants = value;
    }

    getMaxRounds(): number {
        return this._maxRounds;
    }

    setMaxRounds(value: number) {
        this._maxRounds = value;
    }

    getSbleuri(): number {
        return this._sbleuri;
    }

    setSbleuri(value: number) {
        this._sbleuri = value;
    }

    public getLobby(){
        return this;
    }

    addParticipant(user: string): void {
        this._players.push(user);
    }

    lobbySettings(maxParticipants: number, maxRounds: number, sbleuri: number, open: boolean): void {
        this._maxParticipants = maxParticipants;
        this._maxRounds = maxRounds;
        this._sbleuri = sbleuri;
        this._open = open;
    }

    removeParticipant(user: string): void {
        this._players.forEach((p, index) => {
            if(p == user){
                this._players.splice(index,1);
            }
        })
    }
}