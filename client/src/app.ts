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
        readline.setPrompt("Hello gamer! Insert your username, please > ");
        readline.prompt();
        readline.on("line", (input: string) => {
            console.log("check regex ", input.match(userRegex)); //TODO non worka bene richiama else if sotto dopo aver inserito la scelta per la lobby
            if(input.match(userRegex) != null){
                socket.emit("set-username", input);
                readline.pause();
            }else if(input.match(userRegex) == null){
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
        readline.setPrompt(message2 + "\n > ");
        readline.prompt();
        readline.on("line", (input: string) => {
            console.log("check regex ", input.match(chooseRegex));
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
        manager.registerPlayer(new PlayerImpl(playerId, username,  settings.initialSbleuri));
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
        console.log(message);
        game(manager.getPlayers())
        // client.fireEvent("first-turn", )
    })

    socket.on("draw-card", (username, playerId)=> {
        console.log("draw card player id ", playerId);
        let card: Card;
        if(playerId == socket.id) {
            card = manager.drawCard(socket.id);
            client.fireEvent("card-drawn", `Player ${username} draw ${card.getName()}`, username, playerId);
        }
    });

    socket.on("another-card", (username, playerId) => {
        console.log("another card message ", username, playerId);
        if(socket.id == playerId){
            readline.setPrompt(`Player ${username} do you want to draw another card? [y/n] > `);
            readline.prompt();
            readline.on('line', (input:string) => {
                if(input.match(boolRegex)){
                    if(input == 'y') client.fireEvent("ask-card", username, playerId);
                }
            })
        }else{
            console.log(`${username} is playing`);
        }
        /*readline.setPrompt(`Player ${message[1]} do you want to draw another card? [y/n] > `);
        readline.prompt();
        readline.on('line', (input:string) => {
            if(input.match(boolRegex)){
                if(input == 'y') client.fireEvent("ask-card", message[1], message[2]);
            }
        })*/
    })
    /*socket.on("round", (msg1, msg2, username, playerId) => {
        console.log(msg1);
        console.log(msg2);
        if(playerId === socket.id){
            client.fireEvent("draw-card", username, playerId)
        }
    });*/
});

function game(players: Map<string, Player>){
    for(let i=1; i<= settings.maxRounds; i++){
        players.forEach(p => {
            client.fireEvent("round", `Round #${i}`, `${p.getusername()} turn`, p.getusername(), p.getId());

            // client.registerEvent("draw-card", usern)
        })
    }
}