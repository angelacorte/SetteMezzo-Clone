const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//import dotenv = require('dotenv')
//const mongoenv = require('custom-env').env('mongo');
//dotenv.config(mongoenv);
import {LobbyModel} from "./lobby/lobby.model";
//const Player = require('player/player.model');

//const dbURL = "mongodb+srv://"+process.env.MONGO_USER+":"+ process.env.MONGO_PASS+"@"+process.env.MONGO_CLUSTER+".kgpdq.mongodb.net/"+process.env.MONGO_DBNAME+"?retryWrites=true&w=majority";
const dbURL = "mongodb+srv://angelacorte:p8juSFok9A5mupA1@cluster0.kgpdq.mongodb.net/setteMezzo?retryWrites=true&w=majority";

export const db = {
    "url": dbURL,
    lobby: LobbyModel,
    //player: Player
}

export async function connectDB() {
    await mongoose.connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("connected to the database SUCCESSFULLY");
    }).catch((err:any)=>{
        console.log("connection to the database FAILED: ", err);
        process.exit();
    });
}

export async function disconnectDB() {
    await mongoose.close((err:any) => {
        console.log('Mongo has disconnected succesfully');
        if(err){
            console.log(err + " on disconnecting from mongo");
        }
    });
}