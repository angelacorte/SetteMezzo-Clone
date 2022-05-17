import { SetteMezzoDeckFactory } from "../deck/DeckFactory";
import { GameState, GameStateImpl } from "./GameState";
import { Player, PlayerImpl } from "../Player";
import { Card } from "../card/Card";

export interface GameStateFactory {
    createGameState(): GameState;
}

export class SetteMezzoGameStateFactory implements GameStateFactory {
    createGameState(): GameState {
        let deck = new SetteMezzoDeckFactory().createDeck();
        let players = new Array<Player>();
        let bets = new Map<string, Array<number>>();
        let playerCards = new Map<string, Array<Card>>()
        return new GameStateImpl(deck, players, bets, playerCards);
    }
    
}