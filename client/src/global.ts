require('dotenv').config()

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'
//GAME MODES
const NEW_LOBBY = "Create a new lobby";
const JOIN_LOBBY =  "Join a specific lobby";
const RANDOM_LOBBY = "Join a random lobby";

export const MAX_VALUE: number = 7.5;

export const START_VALUE: number = 0;

export { SERVER_URL, NEW_LOBBY, JOIN_LOBBY, RANDOM_LOBBY }