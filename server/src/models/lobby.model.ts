import {Schema, Types, model} from "mongoose";

/**
 * Represent main informations about a lobby, its ID, the owner of the lobby and the partecipants
 */
export interface Lobby {
    id: string;
    //status: ,
    participants?: Types.Array<string>;
    owner: string;
}

/**
 * Defines the types and the necessity of its fields
 */
const lobbySchema = new Schema<Lobby>({
    id: {type: String, required: true},
    participants: [{type: String}],
    owner: {type: String, required: true} //technical debt lol - maybe in the future we may use a user schema if we want to remember users (match history)
});

//export const LobbyModel = model<Lobby>('Lobby', lobbySchema);