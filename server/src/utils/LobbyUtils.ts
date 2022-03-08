import {Lobby} from "../models/lobby.model";
import {LobbyState} from "../../../client/src/models/lobby/lobbyState"
/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils{

    /**
     * Create random lobby
     * @param owner the one who wants to create the lobby
     * @param settings
     * @return new Lobby
     */
    createLobby(owner: string, settings: any): Lobby;

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param lobbyID the id of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @return code to check if the creation gone wrong or not
     */
    lobbySettings(lobbyID: string, maxParticipants: number, maxRounds: number, sbleuri: number): number;

    //NOTE: those methods are just for one participant because
    //server won't wait for other users to join/leave at the same time
    /**
     * Add one participant to a lobby
     * @param lobbyID ID of the lobby to join
     * @param user user to add to the lobby
     * @return lobby infos
     */
    addParticipant(lobbyID: string, user:string): Lobby;

    /**
     * Remove one participant from a lobby
     * @param lobbyID ID of the lobby to leave
     * @param user user to remove from the lobby
     * @return lobby infos
     */
    removeParticipant(lobbyID:string, user:string): Lobby;

    /**
     * Change the lobby state
     * @param state enum
     * @return lobby infos
     */
    changeState(state: LobbyState): Lobby;
}