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
                .filter((l) => l.getState() != LobbyState.STARTED)
                .map((l) => l.getId());
}

function joinLobby(userName: string, userId: string, ownerId: string, lobbyName: string) {
    io.to(ownerId).emit("guest-joined", userName, userId);
    io.to(userId).emit("lobby-joined", lobbyName, ownerId);
}

io.on('connect', (socket: Socket)=>{

    socket.on("create-lobby", (lobby: string, maxRounds: number, maxParticipants: number, initialSbleuri: number) => {
        lobbyUtils.addLobby(new Lobby(lobby, socket.id, LobbyState.CREATED, maxParticipants, maxRounds, initialSbleuri))
        io.to(socket.id).emit("lobby-created", lobby);
    })

    socket.on("join-lobby", (lobby: string, username: string, userId: string) => {
        if(refreshActiveLobbies().some((l) => l === lobby)){
            socket.join(lobby);
            socket.data.lobby = lobby;
            let ownerId = lobbyUtils.getLobby(lobby).getOwner();
            joinLobby(username, userId, ownerId, lobby);
        } else {
            io.to(userId).emit("retry-lobby");
        };
    });

    socket.on("join-random-lobby", (userName, userId) => {
        let activeLobbies = refreshActiveLobbies();
        let lobby = activeLobbies[utils.getRandomInt(activeLobbies.length)]
        socket.join(lobby);
        socket.data.lobby = lobby;
        let ownerId = lobbyUtils.getLobby(lobby).getOwner();
        joinLobby(userName, userId, ownerId, lobby);
    });

    socket.on("start-game", ()=> {
        io.to(socket.data.lobby).emit("start-game");
    });

    socket.on("update-game-state", ()=>{
        io.to(socket.data.lobby).emit("update-game-state")
    })
});

