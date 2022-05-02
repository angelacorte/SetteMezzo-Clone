import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {connectDB} from "./models/db.index";
const express = require('express');
const routes = require('./routes/routes');
const utils = require("./utils/utils");
import {GameManager} from "../../client/src/GameManager";
import {LobbyUtilsImpl} from "./utils/LobbyUtils";
import {Lobby, LobbyState} from "./models/lobby/Lobby";

const app = express();
export const PORT = 3000;

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

const httpServer = createServer(app);
const io = new Server(httpServer);
let settings: {
    maxParticipants: number,
    maxRounds: number,
    initialSbleuri: any,
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

// connectDB();

io.on('connect', (socket: Socket)=>{

    io.to(socket.id).emit("ask-username");

    socket.on("set-username", (username) => {
        socket.data.username = username;
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
            io.to(room).emit("new-join", `User ${socket.data.username} joined the lobby ${room}`, socket.id);
            io.to(room).emit("set-participants");
        }else if (message == 2){ //join a specific lobby
            io.to(socket.id).emit("insert-lobby", "Insert a valid lobby code > ", activeLobbies);
        }else if (message == 3){ //join a random lobby
            let room = activeLobbies[utils.getRandomInt(activeLobbies.length)]  //todo check on maxparticipants and status
            socket.join(room);
            io.to(room).emit("new-join", `User ${socket.data.username} joined the lobby ${room}`, socket.id);
        }else io.to(socket.id).emit("retry-action");
    });

    socket.on("max-participants", () => {
        io.to(socket.data.room).emit("set-rounds");
    });

    socket.on("max-rounds", () => {
        io.to(socket.data.room).emit("set-sbleuri");
    });

    socket.on("init-sbleuri", () => {
        io.to(socket.data.room).emit("set-public");
    });

    socket.on("is-public", (sets: any) => {
        settings = sets;
        lobbyUtils.addLobby(socket.data.room, socket.id, settings);
        console.log(lobbyUtils.getLobbies()); //TODO check that's everything fine
        io.to(socket.data.room).emit("start-game");
    });

    socket.on("join-lobby", (lobby) => {
        let activeLobbies = lobbyUtils.getLobbies();
        if(activeLobbies.some((l:Lobby) => l.getId() === lobby)){
            socket.join(lobby);
            io.to(lobby).emit("new-join", `User ${socket.data.username} joined the lobby ${lobby}`, socket.id); //TODO check why socket.id is undefined
        }else io.to(socket.id).emit("retry-lobby");
    });

    socket.on("start", () => {
        lobbyUtils.changeState(socket.data.room, LobbyState.STARTED);
        io.to(socket.data.room).emit("starting", "Get ready!");
    });

    socket.on("disconnect", () => {
        console.log("Client with id: "+socket.id+" disconnected.");
        //todo check on socket's room, if empty delete it
    });

});

