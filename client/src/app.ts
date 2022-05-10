import io from "socket.io-client"
import {SocketIoClient} from "./Client";
import {GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import {read} from "fs";
import {Player, PlayerImpl} from "./model/Player";
import { EventMap } from "./EventMap";
import {Card} from "./model/card/Card";
const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const client = new SocketIoClient(socket);
const manager = new GameManagerImpl(new SetteMezzoGameStateFactory().createGameState());
const numberRegex = new RegExp(/\d/);
const boolRegex = new RegExp(/[y|n]/);
const startRegex = new RegExp(/s/);
const userRegex: RegExp = new RegExp(/[a-zA-Z]+\d*/g);
const chooseRegex: RegExp = new RegExp(/[123]/);

let username: string = "";
let players: Array<Player> = new Array<Player>();
let ownerId: string = "";

let settings: { maxParticipants: number; maxRounds: number; initialSbleuri: number; isOpen: boolean } /*players: Player[], ownerId: string */ = {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 0, //if 0 means no bets
    isOpen: true
    // players: [],
    // ownerId: ''
}

//SETUP GAME CLIENT EVENT HANDLERS
client.registerEvents(new EventMap(manager).getEventMap())

socket.on('connect', ()=>{
    socket.on("ask-username", ()=>{
        readline.question("Hello gamer! Insert your username, please > ", (user: string) => {
            if(user.match(userRegex) != null){
                username = user;
                socket.emit("set-username", user);
                readline.pause();
            }else {
                readline.setPrompt("Username not valid, must not begin with a number. Retry > ");
                readline.prompt();
            }
        });
    });

    socket.on("hi-socket",(message)=>{
        console.log(message);
    });

    socket.on("choose-action", (message1, message2)=>{
        console.log(message1);
        readline.question(message2 + "\n > ", (input: string) => {
            if(input.match(chooseRegex) != null){
                socket.emit("action-chosen", input);
                readline.pause();
            }else{
                readline.setPrompt("Not a valid option, retry > ");
                readline.prompt();
            }
        });
    });

    socket.on("new-join", (message, username, playerId) => {
        manager.registerPlayer(new PlayerImpl(playerId, username, settings.initialSbleuri));
        console.log(message);
    });

    socket.on("insert-lobby", (message, rooms) => {
        console.log("Valid lobbies: ", rooms)
        readline.question(message, (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        })
    });

    socket.on("retry-lobby", ()=>{
        readline.question("Not a valid lobby, retry > ", (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        });
    });

    socket.on("set-participants", () => {
        readline.question("Set the max number of participants [default 10] > ", (input:string) => {
            if(input.length != 0 && input.match(numberRegex)) settings.maxParticipants = Number(input);
            socket.emit("max-participants");
            readline.pause();
        })
    });

    socket.on("set-rounds", () => {
        readline.question("Set the max number of rounds [default 3] > ", (input:string) => {
            if(input.length != 0 && input.match(numberRegex)) settings.maxRounds = Number(input);
            socket.emit("max-rounds");
            readline.pause();
        });
    });

    socket.on("set-sbleuri", () => {
        readline.question("Set the initial number of sbleuri\n[if don't want to use them, just press enter] > ", (input: string) => {
            if(input.length != 0 && input.match(numberRegex)) settings.initialSbleuri = Number(input);
            if(settings.initialSbleuri != 0) manager.getPlayer(socket.id).addMoney(settings.initialSbleuri);
            socket.emit("init-sbleuri");
            readline.pause();
        });
    });

    socket.on("set-public", () => {
        readline.question("Is the lobby public? y(es) / n(o) [default yes] > ", (input:string) => {
            if(input.length != 0 && input.match(boolRegex)){
                if(input == 'y') settings.isOpen = true;
                else if(input == 'n') settings.isOpen = false;
            }else settings.isOpen = true;
            socket.emit("is-public", settings);
            readline.pause();
        });
    });

    socket.on("start-game", () => {
        readline.question("Press 's' when you want to start playing > \n", (input: string) => {
            if(input.match(startRegex)){
                manager.getPlayers().forEach(p => {
                    players.push(p);
                });
                ownerId = socket.id;
                socket.emit("start", ownerId, players, settings);
                readline.pause();
            }
        });
    });

    socket.on("get-infos", (owId, pls, sets) => {
        console.log("======= STARTING =======");
        console.log("==== ROUND #1 ====");
        if(socket.id != owId) {
            ownerId = owId;
            settings = sets;
            pls.forEach((p:any) => {
                players.push(new PlayerImpl(p.id, p.username, p.moneyAmount));
            })
        } else {
            ownerId = socket.id;
            client.fireEvent("start-round", 1, 0);
        }
    })

    socket.on("next-player", (round, playerTurn) => {
        if(players[playerTurn].getId() == socket.id){
            client.fireEvent("ask-card", round, playerTurn);
        }
    });

    socket.on("next-round", (round, playerTurn) => {
        if(round > settings.maxRounds){
            if(players[playerTurn].getId() == socket.id){
                client.fireEvent("end-game");
            }
        }else{
            console.log("==== ROUND #" + round + " ====");
            if(players[playerTurn].getId() == socket.id){
                client.fireEvent("ask-card", round, playerTurn);
            }
        }
    });

    socket.on("draw-card", (round, playerTurn)=> {
        console.log("=== " + players[playerTurn].getusername() + "'s turn ===");
        if(socket.id == players[playerTurn].getId()) {
            let card = manager.drawCard(socket.id);
            console.log('You draw ' + card.getName());
            client.fireEvent("card-drawn", "", round, playerTurn);
        }else{
            console.log(`${players[playerTurn].getusername()} is playing`);
        }
    });

    socket.on("another-card", (msg, round, playerTurn) => {
        if(players[playerTurn].getId() == socket.id){
            readline.question(`Player ${username} do you want to draw another card? [y/n] > `, (input:string) => {
                if(input.match(boolRegex)){
                    if(input == 'y') {
                        let card = manager.drawCard(socket.id);
                        console.log('You draw ' + card.getName());
                        readline.pause();
                        client.fireEvent("card-drawn", `Player ${username} draw ${card.getName()}`, round, playerTurn);
                    } else client.fireEvent("end-turn", round, playerTurn+1, players);
                }
            });
        }else{
            console.log(`${players[playerTurn].getusername()} is playing`);
            if(msg.length > 0) console.log(msg);
        }
    });

    socket.on("end-game", (message) => {
        console.log(message); //todo
    })
});
