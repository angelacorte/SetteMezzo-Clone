import SocketMock from 'socket.io-mock'

describe('My Client', ()=>{

    let socket: any;

    beforeAll(()=>{
        //initialize a mock socket and client
        socket = new SocketMock();
    })

    it('registers event listeners', ()=>{
        
    });
})