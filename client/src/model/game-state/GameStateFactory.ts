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
        let players = new Map<string, Player>();
        let bets = new Map<string, number>();
        let table = new Map<string, Card[]>()
        return new GameStateImpl(deck, players, bets, table);
    }
    
}