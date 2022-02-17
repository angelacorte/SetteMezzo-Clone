export enum cardSuit {
    SWORDS,
    CUPS,
    COINS,
    CLUBS
};

const suitValues = enumValues(cardSuit);

export function getRandomSuit() {
    const randomInt = getRandomInt(0, suitValues.length);
    return suitValues[randomInt];
}