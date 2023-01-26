import { JOIN_LOBBY, NEW_LOBBY, RANDOM_LOBBY } from "../global";
import { newPlayer, Player } from "../model/player/Player";
import { Client } from "./Client"
import * as stio from './stio'
import {LobbySettings, createLobby} from '../model/lobby/Lobby'

let player: Player

function StartMenu(client: Client){
    client.eventObservable('connect').subscribe(async ()=>{
        let username = await stio.askQuestion("Hello gamer! Insert your username, please > ");
        player = newPlayer(client.id(), username, 0);
        let action = await stio.askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]);
        switch (action) {
            case NEW_LOBBY:
                const lobbySettings = await lobbyCreation()
                client.sendEvent('create-lobby', lobbySettings)
                break;
            case JOIN_LOBBY:
                let toJoin = await stio.askQuestion("Please, insert a lobby name > ");
                client.sendEvent('join-lobby', {lobbyName: toJoin, playerName: player.name, playerId: player.id});
                break;
            case RANDOM_LOBBY:
                client.sendEvent("join-random-lobby", {playerName: player.name, playerId: player.id});
                break;
        }
    })
}

function GuestJoined(client: Client) {
    client.eventObservable('guest-joined').subscribe((user) => console.log(`${user} joined`))
}

async function lobbyCreation(): Promise<LobbySettings> {
    try {
        let toCreate = await stio.askQuestion("Please, insert a lobby name > ");
        let maxRounds = await stio.askQuestion("How many turns you want to play at most? > ");
        let maxPlayers = await stio.askQuestion("How many players do you want at most? > ");
        let initialMoney = await stio.askQuestion("How many sbleuri you want to play with? > ");
        return Promise.resolve(createLobby(toCreate, maxRounds, maxPlayers, initialMoney)) 
    } catch (err) {
        return Promise.reject(err)
    } 
}

export { StartMenu, GuestJoined }