import { Socket } from "socket.io-client";

/**
 * A Generic Client can fire events to the Server and register event listeners.
 */
export interface Client {
    /**
     * Register a listener for a specified event.
     * @param eventName The name of the event.
     * @param listener The listener to call when the event is received.
     */
    registerEvent(eventName: string, listener: (...args: any[]) => void): void;

    /**
     * Register multiple event listeners.
     * @param eventMap A map of the events and the respective listeners.
     */
    registerEvents(eventMap: Map<string, (...args: any[]) => void>): void;

    /**
     * Emits the event to the Server.
     * @param eventName The event name.
     * @param payLoad The optional payload.
     */
    fireEvent(eventName: string, ...payLoad: any[]): void;
}

/**
 * Wrapper for a @Socket.io web socket client.
 */
export class SocketIoClient implements Client{
    /**
     * A client socket.
     */
    private socket: Socket;

    /**
     * 
     * @param socket The client socket to wrap.
     */
    constructor(socket: Socket){
        this.socket = socket;
    }

    public registerEvent(eventName: string, listener: (...args: any[]) => void){
        this.socket.on(eventName, (...args: any[])=>{
            listener(args);
        });
    }

    public registerEvents(eventMap: Map<string, (...args: any[]) => void>){
        eventMap.forEach((value: (...args: any[]) => void, key: string)=>{
            this.registerEvent(key, value);
        })
    }

    public fireEvent(eventName: string, ...payLoad: any[]){
        this.socket.emit(eventName, payLoad);
    }
}