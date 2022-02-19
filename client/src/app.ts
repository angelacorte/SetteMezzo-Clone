import io from "socket.io-client"

const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);

socket.on('connect', ()=>{
    console.log("Connected with server");
});