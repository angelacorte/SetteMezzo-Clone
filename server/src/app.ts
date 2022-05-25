import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {LobbyUtilsImpl} from "./utils/LobbyUtils";
import {LobbyState, Lobby} from "./model/lobby/Lobby";

const express = require('express');
const utils = require("./utils/utils");
const app = express();
const PORT = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer);
const lobbyUtils = new LobbyUtilsImpl();

let settings = {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 0,
    isOpen: true
};

console.log("Server running on port: "+PORT);

httpServer.listen(PORT, function () {
    console.log("Listening on port: " +PORT);
});


function refreshActiveLobbies(): Array<string> {
    return lobbyUtils
                .getLobbies()
                .filter((l) => l.getState() != LobbyState.FULL && l.getState() != LobbyState.STARTED)
                .map((l) => l.getId());
}

io.on('connect', (socket: Socket)=>{

    socket.on("create-lobby", (lobby: string, maxRounds: number, maxParticipants: number, initialSbleuri: number) => {
        const room = lobby;
        socket.join(room);
        socket.data.room = room;
        lobbyUtils.addLobby(new Lobby(lobby, socket.id, LobbyState.CREATED, maxParticipants, maxRounds, initialSbleuri))
        io.to(room).emit("lobby-created", lobby);
    })

    socket.on("join-lobby", (lobby) => {
        if(refreshActiveLobbies().some((l) => l === lobby)){
            socket.join(lobby);
            socket.data.room = lobby;
            io.to(lobby).emit("new-join", socket.data.username, socket.id, lobby, settings, lobbyUtils.getLobby(lobby).getOwner());
        } else {
            io.to(socket.id).emit("retry-lobby")
        };
    });

    socket.on("random-lobby", (message) => {
        let activeLobbies = refreshActiveLobbies();
        let room = activeLobbies[utils.getRandomInt(activeLobbies.length)]
        socket.join(room);
        socket.data.room = room;
        io.to(room).emit("new-join",  socket.data.username, socket.id, room, settings,  lobbyUtils.getLobby(room).getOwner());
    });

    socket.on("start", (ownerId, players, settings) => {
        lobbyUtils.changeState(socket.data.room, LobbyState.STARTED);
        io.to(socket.data.room).emit("get-infos", ownerId, players, settings);
    });

    socket.on("start-round", () => {
        io.to(socket.data.room).emit("start-round");
    });

    socket.on("start-turn", () => {
        io.to(socket.data.room).emit("start-turn");
    })

    socket.on("bet-made", (socketID, bet) => {
        io.to(socket.data.room).emit("bet-made", socketID, bet);
    })

    socket.on("end-turn", () => {
        io.to(socket.data.room).emit("start-turn");
    })

    socket.on("end-game", (message) => {
        io.to(socket.data.room).emit("end-game", "Game ended, wait for results!"); //todo
    })

});

