import {Lobby, LobbyState} from "../model/lobby/Lobby";
/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils {

    /**
     * add a lobby to @lobbies array
     * @param lobby
     */
    addLobby(lobby: Lobby): void;

    /**
     * @returns lobby infos
     * @param lobbyId
     */
    getLobby(lobbyId: string): Lobby;

    /**
     * remove a lobby from @lobbies array
     * @param lobby
     */
    removeLobby(lobby: string): void;


    /**
     * get all the lobbies
     */
    getLobbies(): Lobby[];

    /**
     * change the status of the lobby
     * @param lobbyId
     * @param state
     */
    changeState(lobbyId: string, state: LobbyState): void;
}

export class LobbyUtilsImpl implements LobbyUtils{
    private lobbies: Lobby[] = [];

    public addLobby(lobby: Lobby): void {
        this.lobbies.push(lobby);
    }

    public getLobbies(): Lobby[] {
        return this.lobbies;
    }

    public removeLobby(lobby: string): void {
        this.lobbies.some((l, i) => {
            if(l.lobbySettings.lobbyName === lobby){
                this.lobbies.splice(i, 1);
            }
        })
    }

    public changeState(lobbyId: string, state: LobbyState): void{
        this.lobbies.some((l, i) => {
            if(l.lobbySettings.lobbyName === lobbyId){
                l.state = state;
            }
        })
    }

    getLobby(lobbyId: string): Lobby {
        let lobby: Lobby = this.lobbies.filter((l:Lobby) => l.lobbySettings.lobbyName == lobbyId)[0];
        if(!lobby) throw new Error("Lobby not found");
        return lobby;
    }
}