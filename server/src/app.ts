import bodyParser from "body-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import {connectDB} from "./models/db.index";
const express = require('express');
const routes = require('./routes/routes');
const utils = require("./utils/utils");
import {SocketIoServer} from "./utils/ServerUtils";

const app = express();
export const PORT = 3000;

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

const httpServer = createServer(app);
const io = new Server(httpServer);

console.log("Server running on port: "+PORT);

httpServer.listen(PORT, function () {
    console.log("Listening on port: " +PORT);
});

//const server = new SocketIoServer(io);

routes(app);

connectDB();

io.on('connect', (socket: Socket)=>{
    console.log("Client with id: "+socket.id+" connected.");

    io.to(socket.id).emit("set username");
    socket.on("set username", (username) => {
        socket.data.username = username;
    });

    io.to(socket.id).emit("chose action"); //create new lobby, join existing or random lobby

    socket.on("join-lobby", (lobby) => {
        socket.join(lobby);
    });

    socket.on("start-game", () => {

    });

    socket.on("disconnect", () => {
        console.log("Client with id: "+socket.id+" disconnected.");
    });
});

