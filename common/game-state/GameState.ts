import {Deck} from "../deck/Deck";
import {Player} from "../player/Player";

/**
 * Contains every information useful to the client application to determine
 * what is going on in the game.
 */
export interface GameState {
    readonly deck: Deck
    readonly players: Array<Player>
}
