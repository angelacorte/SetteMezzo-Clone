import {Lobby, LobbyState} from "../models/lobby/Lobby";
import {LobbyUtils} from "./LobbyUtils";
import {SetteMezzoDeckFactory} from "../../../client/src/model/deck/DeckFactory";


let lobbies: Lobby[] = [];


export class LobbyUtilsImpl implements LobbyUtils{

    public addLobby(lobby: string, id: string, settings: any): void {
        lobbies.push(new Lobby(lobby, id, new SetteMezzoDeckFactory(), LobbyState.CREATED, settings.isOpen, settings.maxParticipants, settings.maxRounds, settings.initialSbleuri));
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

    // lobbySettings(maxParticipants: number, maxRounds: number, initialSbleuri: number, isOpen: boolean): void {
    //     this._maxParticipants = maxParticipants;
    //     this._maxRounds = maxRounds;
    //     this._initialSbleuri = initialSbleuri;
    //     this._isOpen = isOpen;
    // } //maybe useless

}