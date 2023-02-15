/**
 * Settings that determine how the game will be played.
 */
export interface LobbySettings {
    readonly lobbyName: string
    readonly maxPlayers: number
    readonly maxRounds: number
}

/**
 * Models the informations necessary to join a Lobby.
 */
export interface LobbyJoining {
    readonly lobbyName: string,
    readonly username: string,
    readonly userId: string
}