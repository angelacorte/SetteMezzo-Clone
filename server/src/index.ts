import { Server, Socket } from 'socket.io'

const PORT = 3000;

const io = new Server(PORT);

console.log("Server running on port: "+PORT);

io.on('connection', (socket: Socket)=>{
    console.log("Client with id "+socket.id+" connected");
})