import io from "socket.io-client"

const serverUrl = 'http://localhost:3000';
const socket = io(serverUrl);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', ()=>{
    console.log("Connected with server");

    socket.on("ask-username", ()=>{
        const userRegex: RegExp = /[\D+\d?]+/g; //todo
        readline.question("Hello gamer! Insert your username, please > ", (input: string) => {
            if(input.match(userRegex)){
                socket.emit("set-username", input);
                readline.pause();
            }else{
                console.log("Username not valid, must not begin with a number. Retry > ");
            }
        });
    });


    socket.on("hi-socket",(message)=>{
        console.log(message);
    });

    socket.on("choose-action", (message)=>{
        // const chooseRegex: RegExp = /[123]{1}/g; //todo
        readline.question(message + "\n > ", (input: string) => {
            // if(!input.match(chooseRegex)){
            //     console.log("Not a valid option, retry > ");
            // }else{
            socket.emit("action-chosen", input);
            readline.pause();
            // }
        })
    });

    socket.on("retry-action", ()=>{
        readline.question("Not a valid option, retry > ", (input: string) => {
            socket.emit("action-chosen", input);
            readline.pause();
        });
    });

    socket.on("new-join", (message) => {
        console.log(message);
    });

    socket.on("insert-lobby", (message, rooms) => {
        console.log("Valid lobbies: ", rooms)
        readline.question(message, (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        })
    });

    socket.on("retry-lobby", ()=>{
        readline.question("Not a valid lobby, retry > ", (input: string) => {
            socket.emit("join-lobby", input);
            readline.pause();
        });
    });

});