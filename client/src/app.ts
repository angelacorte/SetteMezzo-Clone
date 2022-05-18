import io from "socket.io-client"
import {GameManager, GameManagerImpl} from "./GameManager";
import {SetteMezzoGameStateFactory} from "./model/game-state/GameStateFactory";
import {LobbyState} from "../../server/src/models/lobby/Lobby"
import {Player, PlayerImpl} from "./model/Player";
import {Card} from "./model/card/Card";
import inquirer from "inquirer";


const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const NEW_LOBBY = "Create a new lobby";
const JOIN_LOBBY =  "Join a specific lobby";
const RANDOM_LOBBY = "Join a random lobby";

let manager: GameManager;
let username: string = "";
let players: Array<Player> = new Array<Player>();
let ownerId: string = "";
let round: number = 0;
let playerTurn: number = -1;
let settings= {
    maxParticipants: 10,
    maxRounds: 3,
    initialSbleuri: 10,
    isOpen: true
}

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

socket.on('connect', async ()=>{
    manager = new GameManagerImpl(new SetteMezzoGameStateFactory().createGameState());
    try {
        username = await askQuestion("Hello gamer! Insert your username, please > ");
        let action = await askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]);
        switch (action) {
            case NEW_LOBBY:
                let toCreate = await askQuestion("Please, insert a lobby name > ");
                let maxRounds = await askQuestion("How many turns you want to play at most? > ");
                let maxPlayers = await askQuestion("How many players do you want at most? > ");
                let initialSbleuri = await askQuestion("How many sbleuri you want to play with? > ");
                socket.emit("create-lobby", toCreate, maxRounds, maxPlayers, initialSbleuri);
                break;
            case JOIN_LOBBY:
                let toJoin = await askQuestion("Please, insert a lobby name > ");
                socket.emit("join-lobby", toJoin);
                break;
            case RANDOM_LOBBY:
                console.log("action: " + action);
                break;
        }
    } catch(error){
        console.log(error);
    }

    socket.on("lobby-created", (lobby)=>{
        console.log(`You created this lobby: ${lobby.name}, ${lobby.maxRounds}, ${lobby.maxParticipants}, ${lobby.initialSbleuri}`)
    });

    socket.on("retry-lobby", async ()=>{
        let toJoin = await askQuestion("Please, insert a valid lobby name > ");
        socket.emit("join-lobby", toJoin);
    });
    /*
    socket.on("new-join", (username, playerId, room, sets, owner) => {
        if(owner == socket.id){
            manager.registerPlayer(new PlayerImpl(playerId, username, settings.initialSbleuri));
            if(manager.getPlayers().length == settings.maxParticipants) {
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
            if(players[playerTurn].getId() == socket.id){
                let card: Card = manager.drawCard(socket.id);
                console.log("You draw " + card.getName());
                socket.emit("card-drawn", socket.id, card);
                socket.emit("ask-bet");
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
    */
});
