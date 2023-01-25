interface LobbySettings {
    readonly name: String
    readonly maxPlayers: Number
    readonly maxRounds: Number
    readonly initialMoney: Number
}

function createLobby(name: String, maxPlayers: Number, maxRounds: Number, initialMoney: Number): LobbySettings {
    return { name: name, maxPlayers: maxPlayers, maxRounds: maxRounds, initialMoney: initialMoney }
} 

export { LobbySettings, createLobby }