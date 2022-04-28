import {Lobby} from "../models/lobby/Lobby";

/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils {

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @param open if the lobby is public or not
     */
    //lobbySettings(maxParticipants: number, maxRounds: number, sbleuri: number, open: boolean): void;

    /**
     * add a lobby to @lobbies array
     * @param lobby
     * @param id
     * @param settings
     */
    addLobby(lobby: string, id: string, settings: any): void;


    /**
     * remove a lobby from @lobbies array
     * @param lobby
     */
    removeLobby(lobby: string): void;


    /**
     * get all the lobbies
     */
    getLobbies(): Lobby[];

    /**
     * Get all public lobbies
     */
    getPublicLobbies(): Lobby[];
}
