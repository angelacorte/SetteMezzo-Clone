/**
 * A generic Player is required to keep track of
 * the amount of money he has left
 */
export interface Player{
    /**
     * @returns the player id.
     */
    getId(): string;

    /**
     * @returns the amount of money the player has left.
     */
    getMoney(): number;

    /**
     * Increase the player's money by a certain amount.
     * @throws Invalid input.
     * @param amount the amount of money to add.
     */
    addMoney(amount: number): void;

    /**
     * Reduce the player's money by a certain amount.
     * @throws Invalid input.
     * @param amount the amount of money to remove.
     */
    removeMoney(amount: number): void;
}

export class PlayerImpl implements Player{
    private id: string;
    private moneyAmount: number;

    constructor(id: string, moneyAmount: number){
        this.id = id;
        this.moneyAmount = moneyAmount;
    }

    /**
     * Checks if given input is negative.
     * @throws Invalid input.
     * @param input to check.
     */
    private checkNegativeInput(input: number){
        if(input < 0){
            throw new Error('Invalid input');
        }
    }

    /**
     * Checks if given input is bigger then the player money amount.
     * @throws Invalid input.
     * @param input to check.
     */
    private checkTooBigInput(input: number){
        if(input > this.getMoney()){
            throw new Error('Invalid input');
        }
    }

    public getId(): string {
        return this.id;
    }

    public getMoney(): number {
        return this.moneyAmount;
    }

    public addMoney(amount: number) {
        this.checkNegativeInput(amount);
        this.moneyAmount += amount;
    }

    public removeMoney(amount: number): void {
        this.checkNegativeInput(amount);
        this.checkTooBigInput(amount);
        this.moneyAmount -= amount;
    }
}