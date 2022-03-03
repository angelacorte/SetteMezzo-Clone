import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {db} from "./models/db.index";
import mongoose from "mongoose";
const express = require('express');
const routes = require('./routes/routes');
const utils = require("./utils/utils");

const app = express();
export const PORT = 3000;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = createServer(app);
const io = new Server(httpServer);

console.log("Server running on port: "+PORT);

io.on('connection', (socket: Socket)=>{
    var randomLobby = utils.getRandomLobby();
    console.log("Client with id: "+socket.id+" connected.");
    console.log("random lobby: " + randomLobby);

    socket.on("send-message", message => {
        console.log(message);
    });

    socket.on("join-lobby", lobby =>{
        socket.join(lobby);
    });

    socket.on("join-random-lobby", () =>{

    });

    socket.on('disconnect', function () {
        console.log("Client with id: " + socket.id + " disconnected.");
    });
});

httpServer.listen(PORT, function () {
    console.log("Listening on port: " +PORT);
});

routes(app);

/*db.mongoose.connect(db.url,{
    //@ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully');
});

db.mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected');
});

db.mongoose.connection.on('error', (error: any) => {
    console.log('Mongo connection has an error', error);
    mongoose.disconnect();
});

db.mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected');
});*/
