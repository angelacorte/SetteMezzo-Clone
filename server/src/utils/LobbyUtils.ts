import {LobbyState, Lobby} from "../models/lobby/Lobby";
/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils{

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @param open if the lobby is public or not
     */
    lobbySettings(maxParticipants: number, maxRounds: number, sbleuri: number, open: boolean): void;

    //NOTE: those "add" and "remove" methods are just for one participant because
    //server won't wait for other users to join/leave at the same time
    /**
     * Add one participant to a lobby
     * @param user user to add to the lobby
     */
    addParticipant(user:string): void;

    /**
     * Remove one participant from a lobby
     * @param user user to remove from the lobby
     */
    removeParticipant(user:string): void;
}
