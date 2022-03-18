import { GameManager, GameManagerImpl } from "../../src/GameManager"
import { SetteMezzoGameStateFactory } from "../../src/model/game-state/GameStateFactory";
import { Player, PlayerImpl } from "../../src/model/Player";

describe('My Game Manager', ()=>{
    let gameManager: GameManager;
    let player: Player;
    const PLAYER_MONEY = 50;

    beforeAll(()=>{
        let gameState = new SetteMezzoGameStateFactory().createGameState();
        gameManager = new GameManagerImpl(gameState);
        player = new PlayerImpl("Player one", PLAYER_MONEY);
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
})