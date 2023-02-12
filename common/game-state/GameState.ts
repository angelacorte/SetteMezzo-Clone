import {Deck} from "../deck/Deck";
import {Player} from "../player/Player";

export interface GameState {
    deck: Deck
    players: Array<Player>
}
