import {Lobby, LobbyState} from "../models/lobby/Lobby";
import {SetteMezzoGameStateFactory} from "../../../client/src/model/game-state/GameStateFactory";
import {GameManager, GameManagerImpl} from "../../../client/src/GameManager";
import {PlayerImpl} from "../../../client/src/model/Player";
let lobbies: Lobby[] = [];

/**
 * Lobby instantiate its params based on Client's preferences
 * keep trace of lobbies and their status
 */
export interface LobbyUtils {

    /**
     * Set the lobby params chosen by the owner of the lobby
     * @param maxParticipants the max number of users in the lobby
     * @param maxRounds the max number of rounds
     * @param sbleuri the value used for the bets
     * @param open if the lobby is public or not
     */
    //lobbySettings(maxParticipants: number, maxRounds: number, sbleuri: number, open: boolean): void;

    /**
     * add a lobby to @lobbies array
     * @param lobby
     * @param id
     * @param settings
     */
    addLobby(lobby: string, id: string, settings: any): void;

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
     * Get all public lobbies
     */
    getPublicLobbies(): Lobby[];

    /**
     * change the status of the lobby
     * @param lobbyId
     * @param state
     */
    changeState(lobbyId: string, state: LobbyState): void;
}

export class LobbyUtilsImpl implements LobbyUtils{

    public addLobby(lobby: string, owenerId: string, settings: any): void {
        lobbies.push(new Lobby(lobby, owenerId, LobbyState.CREATED, settings.isOpen, settings.maxParticipants, settings.maxRounds, settings.initialSbleuri));
    }

    public getLobbies(): Lobby[] {
        return lobbies;
    }

    public getPublicLobbies(): Lobby[] {
        return lobbies.filter(l => l.isOpen());
    }

    public removeLobby(lobby: string): void {
        lobbies.some((l, i) => {
            if(l.getId() === lobby){
                lobbies.splice(i, 1);
            }
        })
    }

    public changeState(lobbyId: string, state: LobbyState): void{
        lobbies.some((l, i) => {
            if(l.getId() === lobbyId){
                l.setState(state);
            }
        })
    }

    getLobby(lobbyId: string): Lobby {
        let lobby: Lobby = lobbies.filter((l:Lobby) => l.getId() == lobbyId)[0];
        if(!lobby) throw new Error("Lobby not found");
        return lobby;
    }
}