import {db} from '../models/db.index';
import {Request, Response} from "express";

let Lobby = db.lobby;

exports.addLobby = function (req: Request,res: Response) {
    let newLobby = new Lobby(req.body);
    newLobby.save( function (err: any, lobby: any) {
        if(err){
            res.send(err);
        }
        res.status(200).json(lobby);
    })
}

exports.getLobbies = function (req:Request, res:Response){
    Lobby.find({}, {"_id":0}).then( result => {
        if(!result){
            return res.status(500).send({message: "an error occurred"});
        }
        console.log(result);
        return res.send(result);
    }).catch(err=> {
        console.log("Error: ", err.message);
    });
}