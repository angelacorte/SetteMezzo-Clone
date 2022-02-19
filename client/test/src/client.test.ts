import SocketMock from 'socket.io-mock'
import { Client } from '../../src/Client'

describe('My Client', ()=>{

    let socket: any, client: Client;

    beforeAll(()=>{
        //initialize a mock socket and client
        socket = new SocketMock();
        client = new Client(socket);
    })

    it('registers event listeners', ()=>{
        //mock some listener callbacks
        const myFirstCallback = jest.fn();
        const mySecondCallback = jest.fn();
        const myThirdCallback = jest.fn();

        //initialize an event map
        const eventMap = new Map();
        eventMap.set('test-event-one', myFirstCallback);
        eventMap.set('test-event-two', myFirstCallback);
        eventMap.set('test-event-three', mySecondCallback);
        eventMap.set('test-event-four', myThirdCallback);

        //register the event map
        client.registerEvents(eventMap);

        //fire the events
        socket.socketClient.emit('test-event-one');
        socket.socketClient.emit('test-event-two');
        socket.socketClient.emit('test-event-three');
        
        expect(myFirstCallback).toHaveBeenCalledTimes(2);
        expect(mySecondCallback).toBeCalled();
        expect(myThirdCallback).toHaveBeenCalledTimes(0);
    });

    it('fires events correctly', ()=>{
        //register an event listener in the server
        socket.on('hello', (message: string)=>{
            expect(message).toEqual("world!")
        });

        //fire the same event the server listens to
        client.fireEvent('hello', "world!");
    });
})