import io from "socket.io-client"
import {SocketIoClient} from "./Client";
import {GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import {read} from "fs";
import {PlayerImpl} from "./model/Player";
import { EventMap } from "./EventMap";
const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const client = new SocketIoClient(socket);
const manager = new GameManagerImpl(new SetteMezzoGameStateFactory().createGameState());
let numberRegex = /\d/;
let boolRegex = /[y|n]/;
let startRegex = /s/;

let settings: {
    maxParticipants: number,
    maxRounds: number,
    initialSbleuri: number,
    isOpen: boolean
} = {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 0, //if 0 means no bets
    isOpen: true
};

//SETUP GAME CLIENT EVENT HANDLERS
client.registerEvents(new EventMap(manager).getEventMap())

socket.on('connect', ()=>{
    console.log("Connected with server");

    socket.on("ask-username", ()=>{
        const userRegex: RegExp = /[\D+\d?]+/g; //todo
        readline.question("Hello gamer! Insert your username, please > ", (input:string) => {
            if(input.match(userRegex)){
                socket.emit("set-username", input);
                readline.pause();
            }else{
                console.log("Username not valid, must not begin with a number. Retry > ");
            }
        });
    });

    socket.on("hi-socket",(message)=>{
        console.log(message);
    });

    socket.on("choose-action", (message)=>{
        // const chooseRegex: RegExp = /[123]{1}/g; //todo
        readline.question(message + "\n > ", (input: string) => {
            // if(!input.match(chooseRegex)){
            //     console.log("Not a valid option, retry > ");
            // }else{
            socket.emit("action-chosen", input);
            readline.pause();
            // }
        })
    });

    socket.on("retry-action", ()=>{
        readline.question("Not a valid option, retry > ", (input: string) => {
            socket.emit("action-chosen", input);
            readline.pause();
        });
    });

    socket.on("new-join", (message, playerId) => {
        manager.registerPlayer(new PlayerImpl(playerId, settings.initialSbleuri));
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
                socket.emit("start");
                readline.pause();
            }
        });
    });

    socket.on("starting", (message) => {
        //TODO check why it returns different users in different client's connections
        console.log("manager ", manager.getPlayers()); //fictitious print just to see if everything's fine --> todo delete in future
        console.log(message);
    })
});