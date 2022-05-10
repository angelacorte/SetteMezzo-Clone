import { GameManager, GameManagerImpl } from "./GameManager";
import { Card } from "./model/card/Card";
import { SetteMezzoGameStateFactory } from "./model/game-state/GameStateFactory";
import { Player } from "./model/Player";

/**
 * An utility class that records a map of events you can pass 
 * to the {@link Client}.
 */
export class EventMap {
    private gameManager: GameManager;
    private map: Map<string, (...args: any[]) => void>;

    constructor(gm: GameManager){
        this.gameManager = gm;
        this.map = new Map()
        this.setupMap()
    }

    private setupMap(){
        this.map.set("card-drawn", (playerId: string, card: Card)=>{
            this.gameManager.getPlayerCards(playerId).push(card)
            this.gameManager.removeCardFromDeck(card);
        })

        this.map.set("bet-made", (playerId: string, bet: number)=>{
            this.gameManager.registerBet(playerId, bet);
        })
    }

    /**
     * 
     * @returns The event map.
     */
    public getEventMap(): Map<string, (...args: any[]) => void> {
        return this.map
    }
}