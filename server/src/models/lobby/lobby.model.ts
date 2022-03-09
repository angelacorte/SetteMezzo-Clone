import {Schema, Types, model} from "mongoose";
import {LobbyState} from "./Lobby";

/**
 * Represent main informations about a lobby, its ID, the owner of the lobby and the partecipants
 */
interface Lobby {
    id: string;
    status: LobbyState,
    participants?: string[];
    owner: string;
    open: boolean;
}

/**
 * Defines the types and the necessity of its fields
 */
const lobbySchema = new Schema<Lobby>({
    id: {type: String, required: true},
    participants: [{type: String}],
    owner: {type: String, required: true}, //technical debt lol - maybe in the future we may use a user schema if we want to remember users (match history)
    open: {type: Boolean, default: false}
});

const LobbyModel = model<Lobby>('Lobby', lobbySchema);