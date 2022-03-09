//import {LobbyModel} from "./lobby.model";
const { MongoClient, ServerApiVersion } = require('mongodb');
import mongoose from "mongoose";
mongoose.Promise = global.Promise;
export const __DB_NAME__ = 'setteMezzo';
const dotenv = require('dotenv');
dotenv.config();

const dbURL = "mongodb+srv://"+process.env["MONGO_USER"]+":"+ process.env["MONGO_PASS"]+"@"+process.env["MONGO_CLUSTER"]+".kgpdq.mongodb.net/"+process.env["MONGO_DBNAME"]+"?retryWrites=true&w=majority";

const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

export function connectDB(){
    client.connect((err:any) => {
        console.log('Mongo has connected succesfully');
    });
}

export function disconnectDB() {
    client.close((err:any) => {
        console.log('Mongo has disconnected succesfully');
    });
}
