import io from "socket.io-client"
import { newPlayer, Player } from "./model/player/Player";
import { GameState, addPlayer, newSetteMezzoGame} from "./model/game-state/GameState";
import * as stio from "./controller/stio";


const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
//GAME MODES
const NEW_LOBBY = "Create a new lobby";
const JOIN_LOBBY =  "Join a specific lobby";
const RANDOM_LOBBY = "Join a random lobby";

let gameState : GameState;
let player: Player;
let ownerId: string;
let lobbyId: string;
let maxPlayers: number;
let initialSbleuri: number;

function joinLobby(lobbyName: string, userName: string, userId: string) {
    socket.emit("join-lobby", lobbyName, userName, userId);
}

function ownerStartGame() {
    /** cose **/
    socket.emit("start-game");
}

function playerStartGame() {
    socket.emit("update-game-state");
}

socket.on('connect', async ()=>{
    gameState = newSetteMezzoGame()
    try {
        let username = await stio.askQuestion("Hello gamer! Insert your username, please > ");
        player = newPlayer(socket.id, username, initialSbleuri);
        let action = await stio.askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]);
        switch (action) {
            case NEW_LOBBY:
                let toCreate = await stio.askQuestion("Please, insert a lobby name > ");
                let maxRounds = await stio.askQuestion("How many turns you want to play at most? > ");
                maxPlayers = await stio.askQuestion("How many players do you want at most? > ");
                initialSbleuri = await stio.askQuestion("How many sbleuri you want to play with? > ");
                socket.emit("create-lobby", toCreate, maxRounds, maxPlayers, initialSbleuri);
                break;
            case JOIN_LOBBY:
                let toJoin = await stio.askQuestion("Please, insert a lobby name > ");
                joinLobby(toJoin, player.name, player.id);
                break;
            case RANDOM_LOBBY:
                socket.emit("join-random-lobby", player.name, player.id);
                break;
        }
    } catch(error){
        console.log(error);
    }

    socket.on("lobby-created", (lobbyName: string)=>{
        console.log(`You created this lobby: ${lobbyName}`);
        joinLobby(lobbyName, player.name, player.id);
    });

    socket.on("retry-lobby", async ()=>{
        let toJoin = await stio.askQuestion("Please, insert a valid lobby name > ");
        joinLobby(toJoin, player.name, player.id);
    });

    socket.on("lobby-joined", (lobby: string, owner: string)=>{
        ownerId = owner;
        lobbyId = lobby;
        console.log(`You joined the lobby: ${lobby}, owned by ${owner}`);
    })

    socket.on("guest-joined", (userName, userId) => {
        if(userName != player.name){
            console.log(`User ${userName} joined the lobby`);
        }
        gameState = addPlayer(gameState, newPlayer(userId, userName, initialSbleuri))
        if(gameState.players.length == maxPlayers) {
            console.log("The last player joined! The game can begin!")
            ownerStartGame();
        }
    });

    socket.on("start-game", ()=> {
        if(player.id != ownerId) {
            playerStartGame();
        }
    })
});
