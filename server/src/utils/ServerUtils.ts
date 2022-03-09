import {Lobby, LobbyState} from "../models/lobby/Lobby";

/**
 * ServerUtils can send messages to Client, create/join Lobbies.
 */
export interface ServerUtils {

    /**
     * User joins a lobby
     * @param userID
     * @param lobbyID (optional if the lobby is random)
     */
    joinLobby(userID: string, lobbyID?: string): void;

    /**
     * User quits a lobby
     * @param userID (optional)
     * @param lobbyID (optional)
     */
    leaveLobby(userID?: string, lobbyID?: string): void;

    /**
     * Generate new random lobby
     * @param ownerID the player who wants to create the lobby
     *
     */
    createLobby(ownerID: string): void; //TODO @return the lobby created

    /**
     *Get all the lobbies that follow its params
     * @param open (optional) lobby public or not
     * @param status (optional)
     * @param orderByParticipants (optional) to give priority to lobbies that are almost full
     * @return array containing all lobbies and their infos
     */
    getLobbies(open?:boolean, status?:LobbyState, orderByParticipants?: boolean): Lobby[];

    /**
     * Delete specific lobby when the last user quits
     * @param lobbyID
     */
    deleteLobby(lobbyID: string): void;
}

export class SocketIoServer implements ServerUtils {

    private io: any;

    constructor(io:any) {
        this.io = io;
    }

    joinLobby(userID: string, lobbyID?: string): void {
        this.io.join(lobbyID);

    }

    leaveLobby(userID?: string, lobbyID?: string): void {

    }

    getLobbies(open?: boolean, status?: LobbyState, orderByParticipants?: boolean): Lobby[] {
        return [];
    }

    createLobby(ownerID: string): void {
        //return new Lobby()
    }

    deleteLobby(lobbyID: string): void {
    }

}