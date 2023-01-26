import { addPlayer, GameState, newSetteMezzoGame } from "../model/game-state/GameState";
import { newPlayer } from "../model/player/Player";
import { Client } from "./Client";

let gameState: GameState


async function GameManager(client: Client) {
    gameState = newSetteMezzoGame()
    const guestJoined = client.eventObservable('guest-joined')
    guestJoined.subscribe((userData) => handleGuestJoined(userData))
}

function handleGuestJoined(userData: any) {
    gameState = addPlayer(gameState, newPlayer(userData.userId, userData.userName))
    console.log(gameState)
}

export { GameManager }