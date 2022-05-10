import io from "socket.io-client"
import {GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import {read} from "fs";
import {Player, PlayerImpl} from "./model/Player";
import {Card} from "./model/card/Card";
const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
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
    initialSbleuri: 10,
    isOpen: true
}


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

    socket.on("new-join", (username, playerId, room) => {
        manager.registerPlayer(new PlayerImpl(playerId, username, settings.initialSbleuri));
        console.log(`User ${username} joined the lobby ${room}`);
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
        readline.question("Set the initial number of sbleuri [default 10] > ", (input: string) => {
            if(input.length != 0 && input.match(numberRegex)) settings.initialSbleuri = Number(input);
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
                ownerId = socket.id;
                manager.getPlayers().forEach((p:Player) => {
                    players.push(p);
                })
                socket.emit("start", ownerId, players, settings);
                readline.pause();
            }
        });
    });

    socket.on("get-infos", (owId, pls, sets) => {
        if(socket.id != owId) {
            settings = sets;
            pls.forEach((p: { id: string, username: string}) => {
                players.push(new PlayerImpl(p.id, p.username, settings.initialSbleuri));
            })
            ownerId = owId;
        } else {
            ownerId = socket.id;
            socket.emit("start-round", 1, 0);
        }
    })

    socket.on("start-round", (round, playerTurn) => {
        if(round >= settings.maxRounds){
            socket.emit("end-game");
        }else{
            if(round == 1) console.log("======= STARTING =======");
            console.log(`==== ROUND #${round} ====`);
            socket.emit("start-turn", round, playerTurn);
        }
    });

    socket.on("start-turn", (round: number, playerTurn: number) => {
        if(playerTurn < players.length && players[playerTurn].getId() == socket.id){
            if(playerTurn == players.length){
                socket.emit("start-round", round+1, 0);
            }else{
                let card: Card = manager.drawCard(socket.id);
                console.log("You draw " + card.getName());
                socket.emit("card-drawn", socket.id, card);
                socket.emit("ask-bet", round, playerTurn);
            }
        }else{
            console.log(`${players[playerTurn].getUsername()} is playing`);
        }
    });

    socket.on("make-bet", (round, playerTurn) => {
        if(players[playerTurn].getId() == socket.id) {
            let sbleuri = players[playerTurn].getMoney();
            if (sbleuri > 0) {
                readline.question(`Make a bet [max ${sbleuri} Sbleuri] > `, (input: string) => {
                    if (input.match(numberRegex) && parseInt(input) <= sbleuri) {
                        manager.registerBet(socket.id, parseInt(input));
                        //TODO understand how to manage sbleuris
                        socket.emit("bet-made", socket.id, parseInt(input));
                        socket.emit("ask-card", round, playerTurn);
                    }
                });
            } else {
                console.log("Sbleuri finished, you lost!"); //todo
            }
        }else{
            console.log(`${players[playerTurn].getUsername()} is making a bet`);
        }
    })

    socket.on("next-player", (round, playerTurn) => {
        if(players[playerTurn].getId() == socket.id){
            socket.emit("ask-first-card", round, playerTurn);
        }
    });

    socket.on("next-round", (round, playerTurn) => {
        if(round > settings.maxRounds){
            if(players[playerTurn].getId() == socket.id){
                socket.emit("end-game");
            }
        }else{
            console.log("==== ROUND #" + round + " ====");
            if(players[playerTurn].getId() == socket.id){
                socket.emit("ask-card", round, playerTurn);
            }
        }
    });

    socket.on("another-card", (round, playerTurn) => {
        if(players[playerTurn].getId() == socket.id){
            readline.question(`Player ${username} do you want to draw another card? [y/n] > `, (input:string) => {
                if(input.match(boolRegex)){
                    if(input == 'y') {
                        let card = manager.drawCard(socket.id);
                        console.log('You draw ' + card.getName());
                        readline.pause();
                        socket.emit("card-drawn", socket.id, card);
                        socket.emit("ask-card", round, playerTurn);
                    } else socket.emit("end-turn", round, playerTurn+1, players.length);
                }
            });
        }else{
            console.log(`${players[playerTurn].getUsername()} is playing`);
        }
    });

    socket.on("card-drawn", (playerId: string, card: Card) => {
        manager.getPlayerCards(playerId).push(card)
    })

    socket.on("bet-made", (playerId: string, bet: number) => {
        manager.registerBet(playerId, bet);
    })

    socket.on("end-game", (message) => {
        console.log(message); //todo
    })
});
