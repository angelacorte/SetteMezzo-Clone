export interface LobbyCreation {
    lobbyName: string,
    maxRounds: number,
    maxParticipants: number
}

export interface LobbyJoining {
    userId: string,
    username: string,
    lobbyName: string,
    ownerId: string
}
