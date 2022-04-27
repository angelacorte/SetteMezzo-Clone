import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {connectDB} from "./models/db.index";
const express = require('express');
const routes = require('./routes/routes');
const utils = require("./utils/utils");

const app = express();
export const PORT = 3000;

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

const httpServer = createServer(app);
const io = new Server(httpServer);

console.log("Server running on port: "+PORT);

httpServer.listen(PORT, function () {
    console.log("Listening on port: " +PORT);
});

//const server = new SocketIoServer(io);

routes(app);

connectDB();

io.on('connect', (socket: Socket)=>{

    io.to(socket.id).emit("ask-username");

    socket.on("set-username", (username) => {
        socket.data.username = username;
        console.log(`User ${username} connected`);
        io.to(socket.id).emit("hi-socket", `Hi ${username}, let's play!`);
        io.to(socket.id).emit("choose-action", "Please press:\n1 - if you want to create a new lobby \n2 - if you want to join a specific lobby \n3 - if you want to join a random lobby"); //create new lobby, join existing or random lobby
    });

    socket.on("action-chosen", (message) => {
        console.log("User choose " + message);
        console.log(socket.rooms);  //TODO check why it doesn't remembers rooms
        if(message == 1){
            //todo
        }else if (message == 2){
            io.to(socket.id).emit("insert-lobby", "Insert a valid lobby code > ", socket.rooms);
        }else if (message == 3){
            let room = utils.getRandomLobby();
            socket.rooms.add(room)
            console.log(socket.rooms);
            socket.join(room);
            io.to(room).emit("new-join", `User ${socket.data.username} joined the lobby ${room}`);
        }else{
            io.to(socket.id).emit("retry-action");
        }
    });

    socket.on("join-lobby", (lobby) => {
        if(socket.rooms.has(lobby)){
            socket.join(lobby);
        }else{
            io.to(socket.id).emit("retry-lobby");
        }
    });

    socket.on("start-game", () => {

    });

    socket.on("disconnect", () => {
        console.log("Client with id: "+socket.id+" disconnected.");
    });
});

