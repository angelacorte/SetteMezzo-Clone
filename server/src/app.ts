import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {LobbyUtilsImpl} from "./utils/LobbyUtils";
import {GameState} from "../../common/game-state/GameState";
import {LobbyJoining, LobbySettings} from "../../common/lobby/Lobby";
import {Player} from "../../common/player/Player";
import {Lobby, LobbyState} from "./model/lobby/Lobby";

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

function refreshActiveLobbies(): Array<Lobby> {
    return lobbyUtils
                .getLobbies()
                .filter((l) => l.state != LobbyState.STARTED)
}

function joinLobby(lobby: LobbyJoining, ownerId: string) {
    const toSend = {userName: lobby.username, userId: lobby.userId}
    io.to(ownerId).emit("guest-joined", toSend);
}

io.on('connect', (socket: Socket)=>{
    console.log(`socket ${socket.id} connected`)

    socket.on("create-lobby", (lobbySettings: LobbySettings) => {
        let lobby : Lobby = {participants: [], lobbySettings: lobbySettings, owner: socket.id, state: LobbyState.CREATED}
        lobbyUtils.addLobby(lobby)
        io.to(socket.id).emit("lobby-created", lobbySettings);
    })

    socket.on("join-lobby", (lobby: LobbyJoining) => {
        if(refreshActiveLobbies().some((l) => l.lobbySettings.lobbyName === lobby.lobbyName)){
            socket.join(lobby.lobbyName);
            socket.data.lobby = lobby.lobbyName;
            joinLobby(lobby, lobbyUtils.getLobby(lobby.lobbyName).owner);
        }
    });

    socket.on("join-random-lobby", (player: Player) => {
        let activeLobbies = refreshActiveLobbies();
        let lobby: Lobby = activeLobbies[utils.getRandomInt(activeLobbies.length)]
        let joining: LobbyJoining = {lobbyName: lobby.lobbySettings.lobbyName, userId: player.id, username: player.name}
        socket.join(lobby.lobbySettings.lobbyName);
        socket.data.lobby = lobby.lobbySettings.lobbyName;
        joinLobby(joining, lobbyUtils.getLobby(lobby.lobbySettings.lobbyName).owner);
    });

    socket.on("start-game", (gs: GameState)=> {
        lobbyUtils.changeState(socket.data.lobby, LobbyState.STARTED)
        let lobbyInfo = lobbyUtils.getLobby(socket.data.lobby)

        //currentPlayer = 0 / currentRound = 1
        io.to(socket.data.lobby).emit("round", {gstate: gs, currentP: 0, currentR: 1, maxR: lobbyInfo.lobbySettings.maxRounds});
    });

    socket.on("next", ({gameState, currentPlayer, currentRound, maxRounds}) => {
        console.log(gameState)
        io.to(socket.data.lobby).emit("round", {gstate: gameState, currentP: currentPlayer, currentR: currentRound, maxR: maxRounds});
    })

    socket.on("won-round", ({gameState, winners, round}) => {
        io.to(socket.data.lobby).emit("round-winner", {gameState: gameState, winners: winners, round: round})
    })

    socket.on("end-game", (victories: any) => { //todo
        io.to(socket.data.lobby).emit("announce-winner", victories);
    })
});

