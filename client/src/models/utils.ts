function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function enumValues(e:any) {
    return  Object.keys(e)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n));
}