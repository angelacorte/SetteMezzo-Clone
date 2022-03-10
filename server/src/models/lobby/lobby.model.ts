import {Schema, Types, model, Document} from "mongoose";
import {LobbyState} from "./Lobby";

/**
 * Represent main informations about a lobby, its ID, the owner of the lobby and the partecipants
 */
interface Lobby extends Document{
    lobbyID: string;
    status: LobbyState,
    participants?: string[];
    owner: string;
    open: boolean;
}

/**
 * Defines the types and the necessity of its fields
 */
const lobbySchema = new Schema<Lobby>({
    lobbyID: {type: String, required: true, unique: true},
    participants: [{type: String}],
    owner: {type: String, required: true}, //technical debt lol - maybe in the future we may use a user schema if we want to remember users (match history)
    open: {type: Boolean, default: false}
});

export const LobbyModel = model<Lobby>('lobby', lobbySchema);