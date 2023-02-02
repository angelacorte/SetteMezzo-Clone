import {Deck} from "../deck/Deck";
import {Player} from "../player/Player";

export interface GameState {
    readonly deck: Deck
    players: Array<Player>
}
