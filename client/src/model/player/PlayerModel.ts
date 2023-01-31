import {Player} from "../../../../common/player/Player";
import {START_VALUE} from "../../global";

export function newPlayer(id: string, name: string): Player {
    return createPlayer(id, name, START_VALUE, START_VALUE)
}

export function createPlayer(id: string, name: string, points: number, wins: number) {
    return { id: id, name: name, points: points, wins: wins}
}
