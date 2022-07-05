import io from "socket.io-client"
import {GameManager, GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import inquirer from "inquirer";
import { PlayerImpl } from "./model/Player";


const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
//GAME MODES
const NEW_LOBBY = "Create a new lobby";
const JOIN_LOBBY =  "Join a specific lobby";
const RANDOM_LOBBY = "Join a random lobby";

let manager: GameManager;
let player: PlayerImpl;
let ownerId: string;
let lobbyId: string;
let maxPlayers: number;
let initialSbleuri: number;

async function askQuestion(message: string) {
    return inquirer
                .prompt({
                    name: 'question_prompt',
                    type: 'input',
                    message: message
                })
                .then((answer)=> Promise.resolve(answer.question_prompt))
                .catch((error)=>Promise.reject(error));
}

async function askChoice(choices:Array<string>) {
    return inquirer
                .prompt({
                    name: 'choice_prompt',
                    message: 'Please, choose:',
                    type: 'rawlist',
                    choices: choices
                })
                .then((answer) => Promise.resolve(answer.choice_prompt))
                .catch((error)=> Promise.reject(error));
}

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
    manager = new GameManagerImpl(new SetteMezzoGameStateFactory().createGameState());
    try {
        let username = await askQuestion("Hello gamer! Insert your username, please > ");
        player = new PlayerImpl(socket.id, username, 0);
        let action = await askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]);
        switch (action) {
            case NEW_LOBBY:
                let toCreate = await askQuestion("Please, insert a lobby name > ");
                let maxRounds = await askQuestion("How many turns you want to play at most? > ");
                maxPlayers = await askQuestion("How many players do you want at most? > ");
                initialSbleuri = await askQuestion("How many sbleuri you want to play with? > ");
                socket.emit("create-lobby", toCreate, maxRounds, maxPlayers, initialSbleuri);
                break;
            case JOIN_LOBBY:
                let toJoin = await askQuestion("Please, insert a lobby name > ");
                joinLobby(toJoin, player.getUsername(), player.getId());
                break;
            case RANDOM_LOBBY:
                socket.emit("join-random-lobby", player.getUsername(), player.getId());
                break;
        }
    } catch(error){
        console.log(error);
    }

    socket.on("lobby-created", (lobbyName: string)=>{
        console.log(`You created this lobby: ${lobbyName}`);
        joinLobby(lobbyName, player.getUsername(), player.getId());
    });

    socket.on("retry-lobby", async ()=>{
        let toJoin = await askQuestion("Please, insert a valid lobby name > ");
        joinLobby(toJoin, player.getUsername(), player.getId());
    });

    socket.on("lobby-joined", (lobby: string, owner: string)=>{
        ownerId = owner;
        lobbyId = lobby;
        console.log(`You joined the lobby: ${lobby}, owned by ${owner}`);
    })

    socket.on("guest-joined", (userName, userId) => {
        if(userName != player.getUsername()){
            console.log(`User ${userName} joined the lobby`);
        }
        manager.registerPlayer(new PlayerImpl(userId, userName, initialSbleuri))
        if(manager.getPlayers().length == maxPlayers) {
            console.log("The last player joined! The game can begin!")
            ownerStartGame();
        }
    });

    socket.on("start-game", ()=> {
        if(player.getId() != ownerId) {
            playerStartGame();
        }
    })

    socket.on("update-game-state", ()=>{
        socket.emit("broadcast-game-state")
    });
});
