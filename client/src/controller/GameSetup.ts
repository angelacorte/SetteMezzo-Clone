import { map, of, switchMap } from "rxjs";
import { addPlayer, GameState, newSetteMezzoGame } from "../model/game-state/GameState";
import { LobbySettings } from "../model/lobby/Lobby";
import { newPlayer } from "../model/player/Player";
import { client } from "./Client";
import { lobby } from "./StartMenu";

const gamestate = lobby
    .pipe(
        switchMap(({player, lobby$})=>
            of(newSetteMezzoGame())
                .pipe(
                    map((gstate)=>({player, lobby$, gstate}))
                )
        )
    )

const guestJoining = gamestate
        .pipe(
            switchMap(({player, lobby$, gstate})=>
                client.eventObservable('guest-joined')
                    .pipe(
                        map(userData => ({gstate, lobby$, userData}))
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
    console.log(`L'ultimo giocatore si è unito. La partita può cominciare!`)
    client.sendEvent('start-game', gameState)
}
