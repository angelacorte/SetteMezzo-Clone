import { map, of, switchMap } from "rxjs";
import { addPlayer, newSetteMezzoGame } from "../model/game-state/GameStateModule";
import { newPlayer } from "../model/player/PlayerModule";
import { client } from "./Client";
import { lobby } from "./StartMenu";
import {GameState} from "../../../common/game-state/GameState";
import {LobbySettings} from "../../../common/lobby/Lobby";

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
    console.log(`${userData.userName} joined the lobby!`)
}

function startGame(gameState: GameState, lobbySettings: LobbySettings) {
    if(!(gameState.players.length == lobbySettings.maxPlayers)) return
    console.log(`Last player joined the lobby. Let the game begins!`)
    client.sendEvent('start-game', gameState)
}
