import {Lobby, LobbyState} from "../../src/model/lobby/Lobby";
import {getRandomCode, getRandomInt} from "../../src/utils/utils";
import {LobbyUtilsImpl} from "../../src/utils/LobbyUtils";
import exp from "constants";

describe("Lobby utils", () => {

    let lobbyUtils = new LobbyUtilsImpl()
    let lobby: Lobby;
    let allLobbies: Lobby[]
    let lobbyCode = getRandomCode()
    const MAX_ROUNDS = 3
    const MAX_PLAYERS = 5
    beforeAll(() => {
        lobby = {
            lobbySettings: {
                lobbyName: lobbyCode,
                maxPlayers: MAX_PLAYERS,
                maxRounds: MAX_ROUNDS
            },
            owner: "Angela",
            participants: ["Angela", "Leonardo" ,"Mario"],
            state: LobbyState.CREATED
        }
    })

    test("addLobby and getLobbies", () => {
        lobbyUtils.addLobby(lobby)
        allLobbies = lobbyUtils.getLobbies()
        expect(allLobbies).toEqual([lobby])
    })

    test("changeLobbyState", () => {
        lobbyUtils.changeState(lobbyCode, LobbyState.STARTED)
        expect(lobby.state).toEqual(LobbyState.STARTED)
    })

    test("getLobby", () => {
        let getLobby = lobbyUtils.getLobby(lobbyCode)
        expect(getLobby).toEqual(lobby)
    })

    test("removeLobby", () => {
        lobbyUtils.removeLobby(lobbyCode)
        allLobbies = lobbyUtils.getLobbies()
        expect(allLobbies).toEqual([])
    })

    test("getRandomInt", () => {
        let random = getRandomInt(0)
        expect(random).toEqual(getRandomInt(0))
    })

    test("lobbyNotFound", () => {
        expect( () => {
            lobbyUtils.getLobby(lobbyCode)
        }).toThrow('Lobby not found')
    })
})