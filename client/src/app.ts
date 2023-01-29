
require('./controller/StartMenu')
require('./controller/GameSetup')

/*
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
});
*/