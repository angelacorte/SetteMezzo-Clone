import {Schema, Types, model} from "mongoose";

interface Lobby {
    id: string;
    participants?: Types.Array<string>;
    owner: string;
}

const lobbySchema = new Schema<Lobby>({
    id: {type: String, required: true},
    participants: [{type: String}],
    owner: {type: String, required: true} //technical debt lol - maybe in the future we may use a user schema if we want to remember users (match history)
});

export const LobbyModel = model<Lobby>('Lobby', lobbySchema);