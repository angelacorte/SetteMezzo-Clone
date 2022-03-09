export class Player{
    private _id: string;
    private _socket: string;

    constructor(id: string, ip: string) {
        this._id = id;
        this._socket = ip;
    }

    getId(): string {
        return this._id;
    }

    setId(value: string) {
        this._id = value;
    }

    getSocket(): string {
        return this._socket;
    }

    setSocket(value: string) {
        this._socket = value;
    }
}