export interface LobbyCreation {
    lobbyName: string,
    maxRounds: number,
    maxParticipants: number
}

export interface LobbyJoining {
    userId: string,
    username: string,
    lobbyName?: string, //optional so we can use it also on random lobby
    ownerId?: string //optional so we can use it also on random lobby
}