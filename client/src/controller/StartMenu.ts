import { JOIN_LOBBY, NEW_LOBBY, RANDOM_LOBBY } from "../global";
import { client } from "./Client"
import * as stio from './stio'
import { createLobby} from '../model/lobby/LobbyModel'
import { from, map, Observable, switchMap } from "rxjs";
import { newPlayer } from "../model/player/PlayerModel";
import {LobbyJoining, LobbySettings} from "../../../common/lobby/Lobby";
import { Player } from "../../../common/player/Player";

const connection = client.connection()

export const player = connection
    .pipe(
        switchMap(() =>
            from(getPlayer())
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
            client.sendEvent("join-random-lobby", player);
            break;
    }
})

export const lobby = player
    .pipe(
        switchMap(player => 
            client.eventObservable('lobby-created')
                .pipe(
                    map(lobby$ => ({player, lobby$}))
                )
            )
    )
  
lobby.subscribe(({player, lobby$}) => 
    client.sendEvent('join-lobby', {lobbyName: lobby$.lobbyName, username: player.name, userId: player.id}))

const creationError: Observable<LobbySettings> = client.eventObservable('creation-error')

creationError.subscribe(async (oldSettings)=>{
    const newName = await stio.askQuestion('Please, insert another lobby name >')
    const lobbySettings = createLobby(newName, oldSettings.maxPlayers, oldSettings.maxRounds)
    client.sendEvent('create-lobby', lobbySettings)
})

const retrySearch: Observable<LobbyJoining> = client.eventObservable('retry-search')

retrySearch.subscribe(async (joining) => {
    const name = await stio.askQuestion('Lobby not found, please insert another lobby name >')
    client.sendEvent('join-lobby', {lobbyName: name, username: joining.username, userId: joining.userId})
})

async function getPlayer(): Promise<Player> {
    const name = await stio.askQuestion('Hello gamer, please insert your username >')
    return Promise.resolve(newPlayer(client.id(), name))
}

async function lobbyCreation(): Promise<LobbySettings> {
    try {
        let toCreate, maxPlayers, maxRounds

        toCreate = await stio.askQuestion("Please, insert a lobby name > ");
        while(maxPlayers == undefined || Number.isNaN(maxPlayers)) 
            maxPlayers = await stio.askNumber("How many players do you want at most? > ");
        while(maxRounds == undefined || Number.isNaN(maxRounds)) 
            maxRounds = await stio.askNumber("How many turns you want to play at most? > ");
        return Promise.resolve(createLobby(toCreate, maxPlayers, maxRounds))
    } catch (err) {
        console.log('There was a problem during lobby creation, please retry')
        return lobbyCreation()
    } 
}

