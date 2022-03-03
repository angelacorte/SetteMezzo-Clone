import crypto from "crypto";
/**
 * @returns random string that will be used as lobby ID
 */
export function getRandomLobby(){
    return crypto.randomBytes(3).toString('hex');
}