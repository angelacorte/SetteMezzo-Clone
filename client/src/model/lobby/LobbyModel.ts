import {LobbySettings} from "../../../../common/lobby/Lobby";

export function createLobby(name: string, maxPlayers: number, maxRounds: number): LobbySettings {
    return { lobbyName: name, maxPlayers: maxPlayers, maxRounds: maxRounds }
} 
