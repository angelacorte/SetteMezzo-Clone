export interface LobbyCreation {
    lobbyName: string,
    maxRounds: number,
    maxPlayers: number
}

export interface LobbyJoining {
    userId: string,
    username: string,
    lobbyName: string,
    ownerId: string
}

export interface GameState {
    deck: Array<any>, //todo change any
    players: Array<any>, //playerId?
    currentPlayer?: number,
    currentRound?: number
}

export interface PlayerData {
    playerName: string,
    playerId: string
}

export interface VictoriesStatus {
    victories: Map<PlayerData, number>
}