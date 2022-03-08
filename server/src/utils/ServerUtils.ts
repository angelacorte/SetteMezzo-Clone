import {Lobby} from "../models/lobby.model";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {PORT} from "../app";


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

}