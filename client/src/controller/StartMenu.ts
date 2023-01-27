import { JOIN_LOBBY, NEW_LOBBY, RANDOM_LOBBY } from "../global";
import { Client } from "./Client"
import * as stio from './stio'
import {LobbySettings, createLobby} from '../model/lobby/Lobby'
import { from, map, merge, of, switchMap } from "rxjs";
import { newPlayer } from "../model/player/Player";

const client = new Client()

const connection = client.eventObservable('connect')

const player = connection
    .pipe(
        switchMap(() =>
            from(getUsername())
                .pipe(
                    switchMap(name =>
                        of(newPlayer(client.id(), name))
                    )
                )
        )
    )

const action = player
    .pipe(
        switchMap( player =>
            from(stio.askChoice([NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY]))
                .pipe(
                    map(choice => ({player, choice}))
                )
        )
    )

action.subscribe(async ({player, choice}) => {
    switch (choice) {
        case NEW_LOBBY:
            const lobbySettings = await lobbyCreation()
            client.sendEvent('create-lobby', lobbySettings)
            break;
        case JOIN_LOBBY:
            let toJoin = await stio.askQuestion("Please, insert a lobby name > ");
            client.sendEvent('join-lobby', {lobbyName: toJoin, username: player.name, userId: player.id});
            break;
        case RANDOM_LOBBY:
            client.sendEvent("join-random-lobby", {username: player.name, userId: player.id});
            break;
    }
})

const lobby = player
    .pipe(
        switchMap(player => 
            client.eventObservable('lobby-created')
                .pipe(
                    map(lobbyName => ({player, lobbyName}))
                )
            )
    )
  
lobby.subscribe(({player, lobbyName}) => 
    client.sendEvent('join-lobby', {lobbyName: lobbyName, username: player.name, userId: player.id}))

const guest = client.eventObservable('guest-joined').subscribe(data => console.log(data))

async function getUsername() {
    return stio.askQuestion('Hello gamer, please insert your username >')
}

async function lobbyCreation(): Promise<LobbySettings> {
    try {
        const toCreate = await stio.askQuestion("Please, insert a lobby name > ");
        const maxRounds = await stio.askQuestion("How many turns you want to play at most? > ");
        const maxPlayers = await stio.askQuestion("How many players do you want at most? > ");
        const initialMoney = await stio.askQuestion("How many sbleuri you want to play with? > ");
        return Promise.resolve(createLobby(toCreate, maxRounds, maxPlayers, initialMoney)) 
    } catch (err) {
        return Promise.reject(err)
    } 
}

