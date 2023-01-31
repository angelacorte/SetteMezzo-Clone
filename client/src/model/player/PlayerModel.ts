import {Player} from "../../../../common/player/Player";
import {START_VALUE} from "../../global";

export function newPlayer(id: string, name: string): Player {
    return createPlayer(id, name, START_VALUE, START_VALUE)
}

function createPlayer(id: string, name: string, points: number, wins: number) {
    return { id: id, name: name, points: points, wins: wins}
}

export function setPoints(player: Player, points: number): Player {
    return createPlayer(player.id, player.name, points, player.wins)
}
