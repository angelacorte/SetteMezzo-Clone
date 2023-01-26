import { fromEvent, Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "../global";

export class Client {
    private socket: Socket

    constructor(){
        this.socket = io(SERVER_URL)
    }

    public eventObservable(event: string): Observable<any> {
        return fromEvent(this.socket, event)
    }

    public sendEvent(event: string, data: any): Client {
        this.socket.emit(event, data)
        return this
    }

    public id(): string {
        return this.socket.id
    }
}