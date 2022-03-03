/**
 * Server can send messages to Client, create/join Lobbies.
 */
export interface Server {
    /**
     * Create a random lobby
     * @param userID The one who wants to create the lobby
     * @return The lobby code
     */
    createNewLobby(userID:string) : string;

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param lobbyID the id of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @return code to check if the creation gone wrong or not
     */
    lobbySettings(lobbyID: string, maxParticipants: number, maxRounds: number, sbleuri: number): number;

}