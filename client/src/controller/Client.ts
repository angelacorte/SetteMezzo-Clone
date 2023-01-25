import { io, Socket } from 'socket.io-client'
import { SERVER_URL } from '../global'
import { Observable } from 'rxjs'

export class Client {
    private socket: Socket

    constructor() {
        this.socket = io(SERVER_URL)
    }

    public eventObservable(event: string): Observable<any> {
        return new Observable((subscribe)=>{
            this.socket.on(event, (data)=>{
              subscribe.next(data)
            })
        })
    }

    public sendEvent(event: string, ...data: any[]): Client {
        this.socket.emit(event, data)
        return this
    }

    public id(): string {
        return this.socket.id
    }
}