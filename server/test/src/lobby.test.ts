import {Lobby, LobbyState} from "../model/lobby/Lobby";
import {getRandomCode} from "../../src/utils/utils";

describe("My lobby", () => {

    let lobby: Lobby;

    beforeAll(() => {
        lobby = new Lobby(getRandomCode(), "Angela", ["King", "Knight"], LobbyState.CREATED, false, 2, 3, 0);
    });

    test("getLobbyOwner", () => {
        expect(lobby.getOwner()).toEqual("Angela");
    });

    test("changeState", () => {
        lobby.setState(LobbyState.STARTED);
        expect(lobby.getState()).toBe(LobbyState.STARTED);
    });

    test("getLobby", () => {
        expect(lobby.getLobby()).toEqual(lobby);
    });

    test("lobbySettings", () => {
        lobby.lobbySettings(10, 10, 10, true);
        expect(lobby.getMaxParticipants()).toBe(10);
        expect(lobby.getMaxRounds()).toBe(10);
        expect(lobby.isOpen()).toBeTruthy();
    });

    test("changeOwner", () => {
        lobby.setOwner("Leonardo");
        expect(lobby.getOwner()).toEqual("Leonardo");
    });
})