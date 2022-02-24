const Lobby = require('./lobby.model');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
export const __DB_NAME__ = 'setteMezzo';
const dotenv = require('dotenv');

dotenv.config();

const dbURL = 'mongodb+srv://'+process.env["MONGO_USER"]+':'+ process.env["MONGO_PASS"]+'@'+process.env["MONGO_CLUSTER"]+'.kgpdq.mongodb.net/'+process.env["MONGO_DBNAME"]+'?retryWrites=true&w=majority';

export const db = {
    mongoose: mongoose,
    url: dbURL,
    lobby: Lobby
};