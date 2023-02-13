import {LobbySettings} from "../../../../common/lobby/Lobby";

/**
 * Class Lobby represent all the infos that a lobby must have
 */
export interface Lobby{
    readonly lobbySettings: LobbySettings
    owner: string;
    state: LobbyState;
    participants: string[];
}

/**
 * Enum with the states for a lobby
 */
export enum LobbyState {
    CREATED,
    STARTED
};
