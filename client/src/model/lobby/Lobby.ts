interface LobbySettings {
    readonly lobbyName: string
    readonly maxPlayers: number
    readonly maxRounds: number
    readonly initialMoney: number
}

function createLobby(name: string, maxPlayers: number, maxRounds: number, initialMoney: number): LobbySettings {
    return { lobbyName: name, maxPlayers: maxPlayers, maxRounds: maxRounds, initialMoney: initialMoney }
} 

export { LobbySettings, createLobby }