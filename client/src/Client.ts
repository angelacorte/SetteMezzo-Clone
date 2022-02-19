import { Socket } from "socket.io-client";

/**
 * Wrapper for a @Socket.io web socket client.
 */
export class Client {
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

    /**
     * Register a listener for a specified event.
     * @param eventName The name of the event.
     * @param listener The listener to call when the event is received.
     */
    public registerEvent(eventName: string, listener: (...args: any[]) => void){
        this.socket.on(eventName, (...args: any[])=>{
            listener(args);
        });
    }

    /**
     * Register multiple event listeners.
     * @param eventMap A map of the events and the respective listeners.
     */
    public registerEvents(eventMap: Map<string, (...args: any[]) => void>){
        eventMap.forEach((value: (...args: any[]) => void, key: string)=>{
            this.registerEvent(key, value);
        })
    }

    /**
     * Emits the event to the Server.
     * @param eventName The event name.
     * @param payLoad The optional payload.
     */
    public fireEvent(eventName: string, payLoad?: any){
        this.socket.emit(eventName, payLoad);
    }
}