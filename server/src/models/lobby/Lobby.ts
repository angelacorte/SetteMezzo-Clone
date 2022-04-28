import {LobbyUtils} from "../../utils/LobbyUtils";
import {SetteMezzoDeckFactory} from "../../../../client/src/model/deck/DeckFactory";


let lobbies: Lobby[] = [];

/**
 * Enum with the states for a lobby
 */
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
    private _deck: any; //Cards[]
    private _state: LobbyState;
    private _isOpen: boolean;
    private _maxParticipants: number;
    private _maxRounds: number;
    private _initialSbleuri: number;

    constructor(id:string, owner: string, deck: any, state: LobbyState, isOpen: boolean, maxP: number, maxR: number, initialSbleuri: number) {
        this._id = id;
        this._owner = owner;
        this._deck = deck;
        this._state = state;
        this._isOpen = isOpen;
        this._maxParticipants = maxP;
        this._maxRounds = maxR;
        this._initialSbleuri = initialSbleuri;
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
        return this._isOpen;
    }

    setOpen(value: boolean) {
        this._isOpen = value;
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

    getInitialSbleuri(): number {
        return this._initialSbleuri;
    }

    setInitialSbleuri(value: number) {
        this._initialSbleuri = value;
    }

    public getLobby(){
        return this;
    }

    lobbySettings(maxParticipants: number, maxRounds: number, initialSbleuri: number, isOpen: boolean): void {
        this._maxParticipants = maxParticipants;
        this._maxRounds = maxRounds;
        this._initialSbleuri = initialSbleuri;
        this._isOpen = isOpen;
    } //maybe useless

    addLobby(lobby: string, id: string, settings: any): void {
        lobbies.push(new Lobby(lobby, id, new SetteMezzoDeckFactory(), LobbyState.CREATED, settings.isOpen, settings.maxParticipants, settings.maxRounds, settings.initialSbleuri));
    }

    getLobbies(): Lobby[] {
        return lobbies;
    }

    getPublicLobbies(): Lobby[] {
        return lobbies.filter(l => l.isOpen());
    }

    removeLobby(lobby: string): void {
        lobbies.some((l, i) => {
            if(l._id === lobby){
                lobbies.splice(i, 1);
            }
        })
    }
}

