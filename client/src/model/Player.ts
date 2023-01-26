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
     * @returns player's username
     */
    getUsername(): string;

}

export class PlayerImpl implements Player{
    private id: string;
    private username: string;

    constructor(id: string, username: string){
        this.id = id;
        this.username = username;
    }

    getUsername(): string {
        return this.username;
    }

    public getId(): string {
        return this.id;
    }
}