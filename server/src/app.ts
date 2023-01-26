import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {LobbyUtilsImpl} from "./utils/LobbyUtils";
import {Lobby, LobbyState} from "./model/lobby/Lobby";
import {GameState, LobbyCreation, LobbyJoining, PlayerData, VictoriesStatus} from "./model/events/ServerData";

const express = require('express');
const utils = require("./utils/utils");
const app = express();
const PORT = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer);
const lobbyUtils = new LobbyUtilsImpl();

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

function joinLobby(lobbyJoining: LobbyJoining) {
    console.log(lobbyJoining.ownerId + ' ' + lobbyJoining.username)
    io.to(lobbyJoining.ownerId).emit("guest-joined", lobbyJoining.userId, lobbyJoining.username);
    io.to(lobbyJoining.userId).emit("lobby-joined", lobbyJoining.lobbyName, lobbyJoining.ownerId);
}

io.on('connect', (socket: Socket)=>{

    socket.on("create-lobby", (lobbyCreation: LobbyCreation) => {
        lobbyUtils.addLobby(new Lobby(lobbyCreation.lobbyName, socket.id, LobbyState.CREATED, lobbyCreation.maxPlayers, lobbyCreation.maxRounds))
        io.to(socket.id).emit("lobby-created", lobbyCreation.lobbyName);
    })

    socket.on("join-lobby", (lobbyJoining: LobbyJoining) => {
        if(refreshActiveLobbies().some((l) => l === lobbyJoining.lobbyName)){
            socket.join(lobbyJoining.lobbyName);
            socket.data.lobby = lobbyJoining.lobbyName;
            lobbyJoining.ownerId = lobbyUtils.getLobby(lobbyJoining.lobbyName).getOwner();
            joinLobby(lobbyJoining);
        } else {
            io.to(lobbyJoining.userId).emit("retry-lobby");
        }
    });

    socket.on("join-random-lobby", (data: PlayerData) => {
        let lobbyJoining: LobbyJoining = {
            lobbyName: "", ownerId: "", userId: data.playerId, username: data.playerName
        }
        let activeLobbies = refreshActiveLobbies();
        lobbyJoining.lobbyName = activeLobbies[utils.getRandomInt(activeLobbies.length)]
        socket.join(lobbyJoining.lobbyName);
        socket.data.lobby = lobbyJoining.lobbyName;
        lobbyJoining.ownerId = lobbyUtils.getLobby(lobbyJoining.lobbyName).getOwner();
        joinLobby(lobbyJoining);
    });

    socket.on("start-game", (data: GameState)=> {
        console.log("data", data)
        lobbyUtils.changeState(socket.data.lobby, LobbyState.STARTED)
        data.currentPlayer = 0
        data.currentRound = 1
        io.to(socket.data.lobby).emit("round", data);
    });

    socket.on("next", (data: GameState) => {
        io.to(socket.data.lobby).emit("round", data);
    })

    socket.on("end-game", (victories: VictoriesStatus) => {
        io.to(socket.data.lobby).emit("announce-winner", victories);
    })
});

