import { Socket } from "socket.io-client";

export class Client {
    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }

    public registerEvent(eventName: string, callback:Function){
        this.socket.on(eventName, (arg: any)=>{
            callback(arg);
        });
    }
}