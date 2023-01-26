/**
 * Enum with the states for a lobby
 */
export enum LobbyState {
    CREATED,
    STARTED
};

/**
 * Class Lobby represent all the infos that a lobby must have
 */
export class Lobby{
    private readonly _id: string;
    private readonly _owner: string;
    private readonly _maxParticipants: number;
    private readonly _maxRounds: number;
    private _state: LobbyState;

    constructor(id:string, owner: string, state: LobbyState, maxP: number, maxR: number, initialSbleuri: number) {
        this._id = id;
        this._owner = owner;
        this._state = state
        this._maxParticipants = maxP;
        this._maxRounds = maxR;
    }

    getId(): string {
        return this._id;
    }

    getOwner(): string {
        return this._owner;
    }

    getState(): LobbyState {
        return this._state;
    }

    setState(value: LobbyState) {
        this._state = value;
    }

    getMaxParticipants(): number {
        return this._maxParticipants;
    }

    getMaxRounds(): number {
        return this._maxRounds;
    }
}

