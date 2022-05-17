import {SetteMezzoGameStateFactory} from "../../../../client/src/model/game-state/GameStateFactory"


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
export class Lobby{
    private _id: string;
    private _owner: string;
    // private _game: SetteMezzoGameStateFactory; //Cards[]
    private _state: LobbyState;
    private _isOpen: boolean;
    private _maxParticipants: number;
    private _maxRounds: number;
    private _initialSbleuri: number;

    constructor(id:string, owner: string, state: LobbyState, isOpen: boolean, maxP: number, maxR: number, initialSbleuri: number) {
        this._id = id;
        this._owner = owner;
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

}

