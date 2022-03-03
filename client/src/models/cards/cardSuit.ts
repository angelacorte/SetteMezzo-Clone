/**
 * Enum for card suits
 */
export enum cardSuit {
    SWORDS,
    CUPS,
    COINS,
    CLUBS
};

const suitValues = enumValues(cardSuit);

/**
 * @returns random suit defined in enum cardSuit
 */
export function getRandomSuit() {
    const randomInt = getRandomInt(0, suitValues.length);
    return suitValues[randomInt];
}