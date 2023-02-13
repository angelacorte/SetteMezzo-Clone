import {Lobby, LobbyState} from "../../src/model/lobby/Lobby";
import {getRandomCode} from "../../src/utils/utils";

describe("My lobby", () => {

    let lobby: Lobby;
    let code = getRandomCode()
    const MAX_ROUNDS = 3
    const MAX_PLAYERS = 5
    beforeAll(() => {
        lobby = {
            lobbySettings: {
                lobbyName: code,
                maxPlayers: MAX_PLAYERS,
                maxRounds: MAX_ROUNDS
            },
            owner: "Angela",
            participants: ["Angela", "Leonardo" ,"Mario"],
            state: LobbyState.CREATED
        }
        // lobby = new Lobby(code, "Angela", LobbyState.CREATED, 10, 10);
    });

    test("getLobbyOwner", () => {
        expect(lobby.owner).toEqual("Angela");
    });

    test("changeState", () => {
        lobby.state  = LobbyState.STARTED;
        expect(lobby.state).toBe(LobbyState.STARTED);
    });

    test("getLobbyName", () => {
        expect(lobby.lobbySettings.lobbyName).toEqual(code);
    });

    test("getLobbySettings", () => {
        expect(lobby.lobbySettings.maxPlayers).toBe(MAX_PLAYERS);
        expect(lobby.lobbySettings.maxRounds).toBe(MAX_ROUNDS);
    });

    test("changeOwner", () => {
        lobby = {
            lobbySettings: lobby.lobbySettings,
            owner: "Leonardo",
            participants: lobby.participants,
            state: lobby.state
        }
        expect(lobby.owner).toEqual("Leonardo");
    });
})