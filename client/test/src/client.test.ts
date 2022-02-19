import SocketMock from 'socket.io-mock'
import { Client } from '../../src/Client'

describe('My Client', ()=>{

    it('registers event callbacks', ()=>{
        const socket = new SocketMock();
        const client = new Client(socket);
        
        const myCallback = jest.fn();
        client.registerEvent('test-event', myCallback);
        socket.socketClient.emit('test-event');
        expect(myCallback).toBeCalled();
    })
})