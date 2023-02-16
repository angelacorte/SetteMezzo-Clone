import {LobbySettings} from "../../../../common/lobby/Lobby";

/**
 * Factory for Lobby settings
 * @param name The lobby name
 * @param maxPlayers The max number of players to join the lobby
 * @param maxRounds The number of rounds that will be played
 * @returns The lobby settings
 */
export function createLobby(name: string, maxPlayers: number, maxRounds: number): LobbySettings {
    return { lobbyName: name, maxPlayers: maxPlayers, maxRounds: maxRounds }
} 
