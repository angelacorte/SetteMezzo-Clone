import io from "socket.io-client"
import {GameManager, GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import {LobbyState} from "../../server/src/models/lobby/Lobby"
import {read} from "fs";
import {Player, PlayerImpl} from "./model/Player";
import {Card} from "./model/card/Card";
const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let manager: GameManager;
const numberRegex = new RegExp(/\d/);
const boolRegex = new RegExp(/[y|n]/);
const startRegex = new RegExp(/s/);
const userRegex: RegExp = new RegExp(/[a-zA-Z]+\d*/g);
const chooseRegex: RegExp = new RegExp(/[123]/);

let username: string = "";
let players: Array<Player> = new Array<Player>();
let ownerId: string = "";

let round: number = 0;
let playerTurn: number = -1;

let settings: { maxParticipants: number; maxRounds: number; initialSbleuri: number; isOpen: boolean } = {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 10,
    isOpen: true
}


socket.on('connect', ()=>{
    manager = new GameManagerImpl(new SetteMezzoGameStateFactory().createGameState());

    socket.on("ask-username", ()=>{
        readline.question("Hello gamer! Insert your username, please > ", (user: string) => {
            if(user.match(userRegex) != null){
                username = user;
                socket.emit("set-username", user);
                readline.pause();
            }else {
                socket.emit("retry-username");
            }
        });
    });

    socket.on("retry-username", () => {
        readline.question("Not a valid username, must not begin with numbers. Retry > ", (user: string) => {
            if(user.match(userRegex) != null){
                username = user;
                socket.emit("set-username", user);
                readline.pause();
            }else {
                socket.emit("retry-username");
            }
        })
    })

    socket.on("choose-action", (message1, message2)=>{
        console.log(message1);
        readline.question(message2 + "\n > ", (input: string) => {
            if(input.match(chooseRegex) != null){
                socket.emit("action-chosen", input);
                readline.pause();
            }else{
                socket.emit("retry-action", message2);
            }
        });
    });

    socket.on("retry-action", (message) => {
        console.log("Not a valid option, retry. ");
        readline.question(message, (input: string) => {
            if(input.match(chooseRegex) != null){
                socket.emit("action-chosen", input);
                readline.pause();
            }else{
                socket.emit("retry-action", message);
            }
        })
    });

    socket.on("new-join", (username, playerId, room, sets, owner) => {
        if(owner == socket.id){
            manager.registerPlayer(new PlayerImpl(playerId, username, settings.initialSbleuri));
            if(manager.getPlayers().size == settings.maxParticipants) {
                console.log("Lobby has reached max number of participants.");
                socket.emit("change-lobby-state", LobbyState.FULL);
            }
        }else {
            settings = sets;
        }
        console.log(`User ${username} joined the lobby ${room}`);
    });

    socket.on("insert-lobby", () => {
        readline.question("Insert a valid lobby > ", (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        });
    });

    socket.on("retry-lobby", (lobbies: string[])=>{
        console.log("Not a valid lobby.");
        console.log("Lobbies: " + lobbies)
        readline.question("Retry > ", (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        });
    });

    socket.on("set-participants", () => {
        settings.maxParticipants = 10;
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
        socket.emit("change-lobby-state", LobbyState.CREATED);
        readline.question("Press 's' when you want to start playing > \n", (input: string) => {
            if(input.match(startRegex)){
                ownerId = socket.id;
                manager.getPlayers().forEach((p:Player) => {
                    players.push(p);
                })
                socket.emit("change-lobby-state", LobbyState.STARTED);
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
                manager.registerPlayer(new PlayerImpl(p.id, p.username, settings.initialSbleuri));
            })
            ownerId = owId;
        } else {
            ownerId = socket.id;
            socket.emit("start-round");
        }
    })

    socket.on("start-round", () => {
        round += 1;
        playerTurn = -1;
        if(round > settings.maxRounds){
            socket.emit("end-game");
        }else{
            if(round == 1) console.log("======= STARTING =======");
            console.log(`==== ROUND #${round} ====`);
            if(players[0].getId() == socket.id) socket.emit("start-turn");
        }
    });

    socket.on("start-turn", () => {
        playerTurn += 1;
        if(playerTurn < players.length){ //turno non finito
            if(players[0].getId() == socket.id){
                let card: Card = manager.drawCard(socket.id);
                console.log("You draw " + card.getName());
                socket.emit("card-drawn", socket.id, card);
                socket.emit("ask-bet"); //todo qui ci arriva ma poi non va oltre
            }else{
                console.log(`${players[playerTurn].getUsername()} is playing`);
            }
        }else{ //turno finito, prossimo round
            socket.emit("start-round");
        }
    });

    socket.on("make-bet", () => {
        if(players[playerTurn].getId() == socket.id) {
            let sbleuri = players[playerTurn].getMoney();
            if (sbleuri > 0) {
                readline.question(`Make a bet [you have ${sbleuri} Sbleuri] > `, (input: string) => {
                    if (input.match(numberRegex) && parseInt(input) <= sbleuri) {
                        socket.emit("bet-made", socket.id, parseInt(input));
                    }
                });
            } else {
                console.log("Sbleuri finished, you lost!"); //todo
            }
        }else{
            console.log(`${players[playerTurn].getUsername()} is making a bet`);
        }
    })

    socket.on("another-card", () => {
        if(players[playerTurn].getId() == socket.id){
            readline.question(`Player ${username} do you want to draw another card? [y/n] > `, (input:string) => {
                if(input.match(boolRegex)){
                    if(input == 'y') {
                        let card = manager.drawCard(socket.id);
                        console.log('You draw ' + card.getName());
                        readline.pause();
                        socket.emit("card-drawn", socket.id, card);
                    } else socket.emit("end-turn");
                }
            });
        }else{
            console.log(`${players[playerTurn].getUsername()} is playing`);
        }
    });

    socket.on("card-drawn", (playerId: string, card: Card) => {
        manager.getPlayerCards(playerId).push(card);
        socket.emit("ask-card");
    })

    socket.on("bet-made", (playerId: string, bet: number) => {
        manager.registerBet(playerId, bet);
        socket.emit("ask-card");
    })

    socket.on("end-game", (message) => {
        console.log(message); //todo
    })
});
