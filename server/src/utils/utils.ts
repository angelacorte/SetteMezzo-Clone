import crypto from "crypto";

/**
 * @returns random string that will be used as lobby ID
 */
export function getRandomCode(){
    return crypto.randomBytes(3).toString('hex');
}

/**
 * get a random int from 0 to max
 * @param max
 */
export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}