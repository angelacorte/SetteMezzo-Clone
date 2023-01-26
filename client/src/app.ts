import io from "socket.io-client"
import {giveCard, newPlayer, Player} from "./model/player/Player";
import {GameState, addPlayer, newSetteMezzoGame, updateDeck} from "./model/game-state/GameState";
import * as stio from "./controller/stio";
import {JOIN_LOBBY, NEW_LOBBY, RANDOM_LOBBY, MAX_VALUE} from "./global";
import {Card, pointValueOf} from "./model/card/Card";


const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);

let gameState : GameState;

let player: Player;
let ownerId: string;
let lobbyId: string;
let maxPlayers: number;
let maxRounds: number
let currentPlayer: number
let currentRound: number

function joinLobby(lobbyName: string, username: string, userId: string) {
    socket.emit("join-lobby", {lobbyName: lobbyName, username: username, userId: userId})
}

async function askCard(value: number) {
    let card = gameState.deck.pop()
    if(card){
        giveCard(player, card)
        value += pointValueOf(card)
        console.log("You draw " + card.value + ' of ' + card.suit + ' with value ' + pointValueOf(card))
        console.log("Your actual total value is " + value)
    }
    if(value > MAX_VALUE){
        console.log(`You got over ${MAX_VALUE} points, you lost the hand.`)
        currentPlayer += 1
        socket.emit("next", gameState, currentPlayer, currentRound, maxRounds)
    }else{
        let answer = await stio.askQuestion("Do you want to draw another card? - y/n")
        if (answer === 'y') {
            await askCard(value)
        } else if(answer === 'n'){
            currentPlayer += 1
            //todo save somewhere the value, so we can say who wins
            socket.emit("next", gameState, currentPlayer, currentRound, maxRounds)
        }
    }
}

socket.on('connect', async ()=>{
    gameState = newSetteMezzoGame()
    try {
        let username = await stio.askQuestion("Hello gamer! Insert your username, please > ");
        player = newPlayer(socket.id, username);
        let action = await stio.askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]);
        switch (action) {
            case NEW_LOBBY:
                let toCreate = await stio.askQuestion("Please, insert a lobby name > ");
                let maxRounds = await stio.askQuestion("How many turns you want to play at most? > ");
                maxPlayers = await stio.askQuestion("How many players do you want at most? > ");
                socket.emit("create-lobby", {lobbyName: toCreate, maxRounds: maxRounds, maxPlayers: maxPlayers});
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
        console.log(`You created lobby: ${lobbyName}`);
        joinLobby(lobbyName, player.name, player.id);
    });

    socket.on("retry-lobby", async ()=>{
        let toJoin = await stio.askQuestion("Please, insert a valid lobby name > ");
        joinLobby(toJoin, player.name, player.id);
    });

    socket.on("lobby-joined", (lobbyName, owner)=>{
        ownerId = owner;
        lobbyId = lobbyName;
        console.log(`You joined the lobby: ${lobbyName}`);
    })

    socket.on("guest-joined", (userName, userId) => {
        if(userId != player.id) console.log(`Guest ${userName} joined the lobby.`)
        gameState = addPlayer(gameState, newPlayer(userId, userName))
        if(gameState.players.length == maxPlayers) {
            console.log("The last player joined! The game can begin!")
            socket.emit("start-game", gameState);
        }
    });

    socket.on("round", async (gs:GameState, cp, cr, maxR) => {
        gameState = gs
        maxRounds = maxR
        currentPlayer = cp
        currentRound = cr

        if (currentPlayer == gameState.players.length) {
            currentPlayer = 0
            currentRound += 1

            if (currentRound > maxRounds) {
                socket.emit("end-game") //todo add wins as parameter
            }else{
                console.log("== ROUND #", currentRound)
                console.log(`${gameState.players[currentPlayer].name}'s turn`)
                if ( gameState.players[currentPlayer].id == player.id) {
                    await askCard(0)
                }
            }
        }else {
            console.log("== ROUND #", currentRound)
            console.log(`${gameState.players[currentPlayer].name}'s turn`)
            if ( gameState.players[currentPlayer].id == player.id) {
                await askCard(0)
            }
        }
    })

    socket.on("announce-winner", (victories) => {
        console.log("Game ended. \n THE WINNER IS ...")
    })
});
