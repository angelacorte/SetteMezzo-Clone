import { BehaviorSubject, map, mergeWith, Observable, startWith, withLatestFrom } from "rxjs";
import { addPlayers, newSetteMezzoGame } from "../model/game-state/GameStateModule";
import { newPlayer } from "../model/player/PlayerModule";
import { client } from "./Client";
import { lobby } from "./StartMenu";
import { Player } from "../../../common/player/Player";

const lobbySettings$ = lobby
    .pipe(
        map(({player, lobby$}) => lobby$)
    )

const players$ = new BehaviorSubject<Player[]>([])

const connections$ = client.eventObservable('guest-joined')
    .pipe(
        map(userData => newPlayer(userData.userId, userData.userName))
    )

const disconnections$ = client.eventObservable('client-failed-setup')
    .pipe(
        map(userId => newPlayer(userId, "disconnecting"))
    )

const updates$ = connections$.pipe(mergeWith(disconnections$))

const gameStart$: Observable<boolean> = players$.pipe(
    startWith([]),
    map(players => players.length),
    withLatestFrom(lobbySettings$),
    map(([playerCount, settings]) => playerCount === settings.maxPlayers)
  );
  
gameStart$.subscribe(gameStart => {
    if (gameStart) {
        console.log(`Last player joined the lobby. Let the game begins!`)
        const players = players$.value
        const state = addPlayers(newSetteMezzoGame(), players)
        client.sendEvent('start-game', state)
    }
})

updates$.subscribe(player => {
    const players = players$.value
    const found = players.some(p => p.id == player.id)
    if (!found) {
        const newPlayers = [...players, player]
        players$.next(newPlayers)
        console.log(`${player.name} joined the lobby!`)
    } else {
        const newPlayers = players.filter(p => p.id !== player.id)
        players$.next(newPlayers)
        console.log(`A player left the lobby!`)
    }
})