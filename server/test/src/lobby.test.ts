import {Lobby, LobbyState} from "../../src/model/lobby/Lobby";
import {getRandomCode} from "../../src/utils/utils";

describe("My lobby", () => {

    let lobby: Lobby;
    let code = getRandomCode()
    beforeAll(() => {
        lobby = new Lobby(code, "Angela", LobbyState.CREATED, 10, 10);
    });

    test("getLobbyOwner", () => {
        expect(lobby.getOwner()).toEqual("Angela");
    });

    test("changeState", () => {
        lobby.setState(LobbyState.STARTED);
        expect(lobby.getState()).toBe(LobbyState.STARTED);
    });

    test("getLobby", () => {
        expect(lobby.getId()).toEqual(code);
    });

    test("lobbySettings", () => {
        expect(lobby.getMaxParticipants()).toBe(10);
        expect(lobby.getMaxRounds()).toBe(10);
    });

    test("changeOwner", () => {
        lobby = new Lobby(code, "Leonardo", LobbyState.STARTED, 10, 10)
        expect(lobby.getOwner()).toEqual("Leonardo");
    });
})