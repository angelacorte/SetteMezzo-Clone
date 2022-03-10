import {Lobby, LobbyState} from "../models/lobby/Lobby";
import {Socket} from "socket.io";

/**
 * ServerUtils can send messages to Client, create/join Lobbies.
 */
export interface ServerUtils {

    /**
     * User joins a lobby
     * @param socket
     * @param lobbyID (optional if the lobby is random)
     */
    joinLobby(socket: Socket, lobbyID?: string): void;

    /**
     * User quits a lobby
     * @param socket
     * @param lobbyID (optional)
     */
    leaveLobby(socket: Socket, lobbyID?: string): void;

    /**
     * Generate new random lobby
     * @param socket the player who wants to create the lobby
     *
     */
    createLobby(socket: Socket): void; //TODO @return the lobby created

    /**
     *Get all the lobbies that follow its params
     * @param socket
     * @param open (optional) lobby public or not
     * @param status (optional)
     * @param orderByParticipants (optional) to give priority to lobbies that are almost full
     * @return array containing all lobbies and their infos
     */
    getLobbies(socket: Socket, open?:boolean, status?:LobbyState, orderByParticipants?: boolean): Lobby[];

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

    joinLobby(socket: Socket, lobbyID: string): void {
        socket.join(lobbyID);
        socket.data.lobby = lobbyID; //TODO to add also the username used
        this.io.to(lobbyID).emit("joined-lobby");
    }

    leaveLobby(socket: Socket, lobbyID: string): void {
        socket.leave(lobbyID);
    }

    getLobbies(socket: Socket, open?: boolean, status?: LobbyState, orderByParticipants?: boolean): Lobby[] {
        //socket.rooms
        return [];
    }

    createLobby(socket: Socket): void {
        //return new Lobby()
    }

    deleteLobby(lobbyID: string): void {
    }

}