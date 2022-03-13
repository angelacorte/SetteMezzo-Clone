import {Lobby, LobbyState} from "../models/lobby/Lobby";
import {Socket} from "socket.io";

/**
 * ServerUtils can send messages to Client, create/join Lobbies.
 */
export interface ServerUtils {

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

    getLobbies(socket: Socket, open?: boolean, status?: LobbyState, orderByParticipants?: boolean): Lobby[] {
        //socket.rooms
        return [];
    }

    deleteLobby(lobbyID: string): void {
    }

}