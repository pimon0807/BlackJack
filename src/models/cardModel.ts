import { BlackJackCardConfig } from "../config/blackJackConfig";

export interface Card {
    readonly suit: string;
    readonly rank: string;
    getRankNumber(): number;
}

export class BlackJackCard implements Card {
    constructor(public suit: string, public rank: string) {
    }

    getRankNumber(): number {
        if(this.rank === "A") return 11;
        else if(BlackJackCardConfig.faceCard.includes(this.rank)){
            return 10;
        }else{
            return parseInt(this.rank);
        }
    }
}
