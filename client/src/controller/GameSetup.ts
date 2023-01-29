import { map, of, switchMap } from "rxjs";
import { addPlayer, GameState, newSetteMezzoGame } from "../model/game-state/GameState";
import { LobbySettings } from "../model/lobby/Lobby";
import { newPlayer } from "../model/player/Player";
import { client } from "./Client";
import { lobby } from "./StartMenu";

const connection = client.connection()

const gamestate = connection
    .pipe(
        switchMap(()=>
            of(newSetteMezzoGame())
        )
    )

const guestJoining = gamestate
    .pipe(
        switchMap(gstate =>
            lobby
                .pipe(
                    switchMap(({lobby$}) =>
                        client.eventObservable('guest-joined')
                            .pipe(
                                map(userData => ({gstate, lobby$, userData}))
                            )
                    )
                )  
        )
    )

guestJoining.subscribe(({gstate, lobby$, userData}) => {
    handleGuestJoined(gstate, userData)
    startGame(gstate, lobby$)
})


function handleGuestJoined(gameState: GameState, userData: any) {
    gameState = addPlayer(gameState, newPlayer(userData.userId, userData.userName))
    console.log(`${userData.userName} si è unito alla partita!`)
}

function startGame(gameState: GameState, lobbySettings: LobbySettings) {
    if(!(gameState.players.length == lobbySettings.maxPlayers)) return
    client.sendEvent('start-game', gameState)
}