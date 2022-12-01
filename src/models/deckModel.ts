import{ BlackJackCardConfig } from "../config/blackJackConfig";
import { Card, BlackJackCard } from "./cardModel";

export interface Deck {
    readonly gameType: string;
    cards: Array<Card>;
}

export class BlackJackDeck implements Deck{
    cards: Array<BlackJackCard>;

    constructor(readonly gameType: string){
        this.cards = [];
        this.resetDeck();
    }

    public resetDeck(): void {
        for(let suit of BlackJackCardConfig.suits){
            for(let rank of BlackJackCardConfig.rank){
                this.cards = [...this.cards, new BlackJackCard(suit, rank)]
            }
        }
        this.shuffle();
    }

    private shuffle(): void {
        for(let i=this.cards.length-1; i>0; i--){
            let j = Math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public drawOne(): BlackJackCard | undefined {
        return this.cards.pop();
    }

}