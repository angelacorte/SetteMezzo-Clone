import { GameManager, GameManagerImpl } from "../../src/GameManager"
import { SetteMezzoGameStateFactory } from "../../src/model/game-state/GameStateFactory";
import { Player, PlayerImpl } from "../../src/model/Player";
<<<<<<< HEAD
import SocketMock from 'socket.io-mock'
import { Client, SocketIoClient } from "../../src/Client";

let socket: any;
let client: Client;
let gameManager: GameManager;
let player: Player;
const PLAYER_MONEY = 50;

const setup = ()=>{
    socket = new SocketMock();
    client = new SocketIoClient(socket);
    
    let gameState = new SetteMezzoGameStateFactory().createGameState();
    gameManager = new GameManagerImpl(gameState);
    player = new PlayerImpl("Player one", PLAYER_MONEY);
}

describe('My Game Manager', ()=>{    

    beforeAll(()=>{
        setup();
=======
import { SetteMezzoCard, SetteMezzoValue, BriscolaSuits } from "../../src/model/card/SetteMezzoCard";
import { GameState, GameStateImpl } from "../model/game-state/GameState";

describe('My Game Manager', ()=>{
    let gameManager: GameManager;
    let gameState: GameState;
    let player: Player;
    const PLAYER_MONEY = 50;

    beforeAll(()=>{
        gameState = new SetteMezzoGameStateFactory().createGameState();
        gameManager = new GameManagerImpl(gameState);
        player = new PlayerImpl("Player one", PLAYER_MONEY);
>>>>>>> e395322e7ad99538e5927034f5b0a765892f4c47
    })

    test('there are no players initially', ()=>{
        let players = gameManager.getPlayers();
        expect(players.size).toEqual(0);
    })

    test('register player', ()=>{
        gameManager.registerPlayer(player);
        expect(gameManager.getPlayers().size).toEqual(1);
    })

    test('register bet', ()=>{
        let playerId = player.getId();
        gameManager.registerBet(playerId, 10);
        expect(player.getMoney()).toEqual(PLAYER_MONEY - 10);
        expect(gameManager.getPlayerBets(playerId).length).toEqual(1);
    })

    test('get player cards', ()=>{
        let playerId = player.getId();
        gameManager.drawCard(playerId);
        expect(gameManager.getPlayerCards(playerId).length).toEqual(1);
    })
<<<<<<< HEAD
})

describe('Game State changes as clients interact', ()=>{

    beforeAll(()=>{
        setup();
    })

    test('drawing cards', ()=>{
        
=======

    test('remove card from deck', ()=>{
        gameManager.removeCardFromDeck(new SetteMezzoCard("testCard", SetteMezzoValue.KING, BriscolaSuits.SWORDS))
        expect(gameState.getDeck().getList().length).toBe(39)
>>>>>>> e395322e7ad99538e5927034f5b0a765892f4c47
    })
})