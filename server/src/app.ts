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
        const searched = refreshActiveLobbies().filter(l => l.lobbySettings.lobbyName === lobbySettings.lobbyName).pop()
        if(searched) {
            io.to(socket.id).emit('creation-error', lobbySettings)
        } else {
            const lobby : Lobby = {participants: [], lobbySettings: lobbySettings, owner: socket.id, state: LobbyState.CREATED}
            lobbyUtils.addLobby(lobby)
            io.to(socket.id).emit("lobby-created", lobbySettings);
        }
    })

    socket.on("join-lobby", (joining: LobbyJoining) => {
        const searched = refreshActiveLobbies().filter(l => l.lobbySettings.lobbyName === joining.lobbyName).pop()
        if(searched) {
            searched.participants.push(joining.userId)
            socket.join(joining.lobbyName);
            socket.data.lobby = joining.lobbyName;
            joinLobby(joining, lobbyUtils.getLobby(joining.lobbyName).owner);
        } else {
            io.to(socket.id).emit('retry-search', joining)
        }
    });

    socket.on("join-random-lobby", (player: Player) => {
        const activeLobbies = refreshActiveLobbies();
        const lobby: Lobby = activeLobbies[utils.getRandomInt(activeLobbies.length)]
        lobby.participants.push(player.id)
        const joining: LobbyJoining = {lobbyName: lobby.lobbySettings.lobbyName, userId: player.id, username: player.name}
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
        io.to(socket.data.lobby).emit("round", {gstate: gameState, currentP: currentPlayer, currentR: currentRound, maxR: maxRounds});
    })

    socket.on("card-drawn", ({card, player}) => {
        const otherPlayers = lobbyUtils.getLobby(socket.data.lobby).participants.filter(p => p != player.id)
        otherPlayers.forEach(p => io.to(p).emit("show-card", {card: card, opponent: player}))
    })

    socket.on("disconnect",  () => {
        if(socket.data.lobby){
            //Endgame handling: we remove each participant from the lobby upon disconnection
            //remove participant from lobby
            let lobby = lobbyUtils.getLobby(socket.data.lobby)
            lobby.participants.forEach((p, i) => {
                if (p === socket.id) lobby.participants.splice(i, 1)
            })
            //delete the lobby if it's empty
            if (lobby.participants.length == 0) lobbyUtils.removeLobby(socket.data.lobby)

            //Error handling: if a client fails, the rest of the lobby is notified
            if(lobby.state === LobbyState.CREATED) {
                io.to(socket.data.lobby).emit('client-failed-before-game', socket.id)
            } else {
                io.to(socket.data.lobby).emit('client-failed-in-game', socket.id)
            }
            
        }
    })
});


