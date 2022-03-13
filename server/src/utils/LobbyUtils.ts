/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils{

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @param open if the lobby is public or not
     */
    lobbySettings(maxParticipants: number, maxRounds: number, sbleuri: number, open: boolean): void;
}
