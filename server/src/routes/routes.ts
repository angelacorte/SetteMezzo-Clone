import {Router} from "express";

const lobbyController = require('../controllers/lobby.controller');

module.exports = function (app: Router){

    app.route('/getLobbies')
        .get(lobbyController.getLobbies);

    app.route('/addLobby')
        .post(lobbyController.addLobby);
}