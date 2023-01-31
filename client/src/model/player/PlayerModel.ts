import {Player} from "../../../../common/player/Player";

export function newPlayer(id: string, name: string): Player {
    return createPlayer(id, name, 0, 0)
}

export function createPlayer(id: string, name: string, points: number, wins: number) {
    return { id: id, name: name, points: points, wins: wins}
}
