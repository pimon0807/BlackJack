import { Card, BlackJackCard } from "./cardModel";
import { BlackJackPlayerType, BlackJackActionType, BlackJackStatusType, BlackJackGamePhaseType, BlackJackResultType} from "../config/blackJackConfig";

export interface Player {
    name: string;
    playerType: string;
    gameType: string;
    chips: number;
    betAmount: number;
    hand: Card[];
    status: string;
    isGameOver: boolean;
}

export class BlackJackPlayer implements Player {
    public gameType: string;
    public chips: number;
    public betAmount: number;
    public winAmount: number;
    public hand: Array<BlackJackCard>;
    public status: BlackJackStatusType;
    public isGameOver: boolean;
    public actions: BlackJackActionType[];
    public result: BlackJackResultType;

    constructor(public name: string, public playerType: BlackJackPlayerType){
        this.gameType = "blackjack";
        this.chips = 400;
        this.betAmount = 0;
        this.winAmount = 0;
        this.hand = [];
        this.status = "bet";
        this.isGameOver = false;
        this.actions = ["surrender", "stand", "hit", "double"];
        this.result = null
    }

    promptPlayer(userData?: number | BlackJackActionType): GameDecision{

        if(this.status === "bet"){
            if(this.playerType === "house"){
                return new GameDecision("wait");
            }else if(this.playerType === "ai"){
                let bet = Math.floor(Math.random() * (this.chips/2/5 - 1/5) + 1/5) * 5;
                return new GameDecision("bet" , bet);
            }else{
                return new GameDecision("bet", userData as number)
            }
        }else{
            if(this.playerType === "ai" || this.playerType === "house"){
                if(this.getHandScore() <= 17){
                    return new GameDecision("hit");
                }else{
                    return new GameDecision("stand");
                }
            }else{
                return new GameDecision(userData as BlackJackActionType);
            }
        }
    }

    getHandScore(): number {
        let score = 0;
        let sumOfAce = 0;
        for(let card of this.hand){
            score += card.getRankNumber();
            if(card.rank === "A"){
                sumOfAce++;
            }
        }
        while(score > 21 && sumOfAce > 0){
            score -= 10;
            sumOfAce--;
        }
        return score;
    }
}

export class GameDecision{
    constructor(public action: BlackJackActionType, public amount?: number | undefined){
    }
}