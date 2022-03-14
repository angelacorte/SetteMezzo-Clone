import {Socket} from "socket.io";

/**
 * Class Player represent all the relevant infos of a user
 */
export class Player{
    private _id: string;
    private _socket: Socket;

    constructor(id: string, socket: Socket) {
        this._id = id;
        this._socket = socket;
    }

    getId(): string {
        return this._id;
    }

    setId(value: string) {
        this._id = value;
    }

    getSocket(): Socket {
        return this._socket;
    }

    setSocket(value: Socket) {
        this._socket = value;
    }
}