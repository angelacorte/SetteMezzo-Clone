export interface LobbySettings {
    readonly lobbyName: string
    readonly maxPlayers: number
    readonly maxRounds: number
}
export interface LobbyJoining {
    readonly lobbyName: string,
    readonly username: string,
    readonly userId: string
}