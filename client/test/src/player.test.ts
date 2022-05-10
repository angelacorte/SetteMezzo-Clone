import { Player, PlayerImpl } from '../../src/model/Player'

describe('Player', ()=>{

    const PLAYER_ID: string = "Player-1";
    const PLAYER_USERNAME: string = "Mario";
    const PLAYER_MONEY: number = 50;
    let player: Player;

    beforeEach(()=>{
        player = new PlayerImpl(PLAYER_ID, PLAYER_USERNAME, PLAYER_MONEY);
    })

    test('id', ()=>{
        expect(player.getId()).toEqual(PLAYER_ID);
    })

    test('getMoney', ()=>{
        expect(player.getMoney()).toEqual(PLAYER_MONEY);
    })

    test('getUsername', () => {
        expect(player.getUsername()).toEqual(PLAYER_USERNAME);
    })

    test('addMoney', ()=>{
        const AMOUNT: number = 20;
        player.addMoney(AMOUNT);
        expect(player.getMoney()).toBe(PLAYER_MONEY + AMOUNT);
    })

    test('addMoney throws on invalid input', ()=>{
        const AMOUNT: number = -10;
        expect(()=>player.addMoney(AMOUNT))
                .toThrowError('Invalid input');
    })

    test('removeMoney', ()=>{
        const AMOUNT: number = 20;
        player.removeMoney(AMOUNT);
        expect(player.getMoney()).toEqual(PLAYER_MONEY - AMOUNT);
    })

    test('removeMoney throws error on invalid input', ()=>{
        const AMOUNT: number = 90;
        expect(()=>player.removeMoney(AMOUNT))
                .toThrowError('Invalid input');
    })
})