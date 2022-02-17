export enum cardValue {
    ACE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    JACK,
    KNIGHT,
    KING
};

const cardValues = enumValues(cardValue);

export function getRandomValue() {
    const randomInt = getRandomInt(0, cardValues.length);
    return cardValues[randomInt];
}