import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {connectDB} from "./models/db.index";
const express = require('express');
const routes = require('./routes/routes');
const utils = require("./utils/utils");
import {LobbyUtils} from "./utils/LobbyUtils";
import {LobbyUtilsImpl} from "./utils/LobbyUtilsImpl";
import {Lobby} from "./models/lobby/Lobby";

const app = express();
export const PORT = 3000;

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

const httpServer = createServer(app);
const io = new Server(httpServer);
let settings: {
    maxParticipants: number,
    maxRounds: number,
    initialSbleuri: number,
    isOpen: boolean
} = {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 0,
    isOpen: true
};
let lobbyUtils = new LobbyUtilsImpl();
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
        let activeLobbies: string[] = [];
        lobbyUtils.getLobbies().forEach(l => activeLobbies.push(l.getId()));
        if(message == 1){ //create new lobby
            let room = utils.getRandomCode();
            socket.join(room);
            socket.data.room = room;
            io.to(room).emit("new-join", `User ${socket.data.username} joined the lobby ${room}`);
            io.to(room).emit("set-participants");
        }else if (message == 2){ //join a specific lobby
            io.to(socket.id).emit("insert-lobby", "Insert a valid lobby code > ", activeLobbies);
        }else if (message == 3){ //join a random lobby
            // let rand = new Random(lobbies.length)
            let room = activeLobbies[utils.getRandomInt(activeLobbies.length)]  //todo check on maxparticipants and status
            socket.join(room);
            io.to(room).emit("new-join", `User ${socket.data.username} joined the lobby ${room}`);
        }else{
            io.to(socket.id).emit("retry-action");
        }
    });

    socket.on("max-participants", (nPartc:number) => {
        console.log("nPart ", nPartc);
        settings.maxParticipants = nPartc;
        io.to(socket.data.room).emit("set-rounds");
    });

    socket.on("max-rounds", (nRounds: number) => {
        console.log("nRounds ", nRounds);
        settings.maxRounds = nRounds;
        io.to(socket.data.room).emit("set-sbleuri");
    });

    socket.on("init-sbleuri", (nSbleuri: number) => {
        console.log("nSbleuri ", nSbleuri);
        settings.initialSbleuri = nSbleuri;
        io.to(socket.data.room).emit("set-public");
    });

    socket.on("is-public", (isOpen: boolean) => {
        console.log("isOpen ", isOpen);
        settings.isOpen = isOpen;
        lobbyUtils.addLobby(socket.data.room, socket.data.id, settings);
        io.to(socket.data.room).emit("start-game");
    });

    socket.on("join-lobby", (lobby) => {
        let activeLobbies = lobbyUtils.getLobbies();
        if(activeLobbies.some((l:Lobby) => l.getId() === lobby)){
            socket.join(lobby);
            io.to(lobby).emit("new-join", `User ${socket.data.username} joined the lobby ${lobby}`);
        }else{
            io.to(socket.id).emit("retry-lobby");
        }
    });

    socket.on("start", () => {
        io.to(socket.data.room).emit("starting", "Get ready!");
    });

    socket.on("disconnect", () => {
        console.log("Client with id: "+socket.id+" disconnected.");
    });

});

