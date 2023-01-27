export interface LobbyCreation {
    lobbyName: string,
    maxRounds: number,
    maxParticipants: number
}

export interface LobbyJoining {
    lobbyName: string,
    username: string,
    userId: string,
    ownerId: string
}

export interface GameState {
    deck: Array<any>, //todo change any
    players: Array<any>, //playerId?
}

export interface PlayerData {
    playerName: string,
    playerId: string
}

export interface VictoriesStatus {
    victories: Map<PlayerData, number>
}