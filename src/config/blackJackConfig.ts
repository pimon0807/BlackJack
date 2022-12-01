
export class BlackJackCardConfig {
    static readonly suits: string[] = ["H", "D", "C", "S"];
    static readonly rank: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    static readonly faceCard: string[] = ["J", "Q", "K"];
}

export type BlackJackPlayerType = "house" | "user" | "ai";

export type BlackJackActionType = "bet" | "surrender" | "stand" | "hit" | "double" | "wait";

export type BlackJackStatusType = BlackJackActionType | "blackjack" | "bust";

export type BlackJackGamePhaseType = "betting" | "acting" | "evaluatingWinners" | "gameOver" | "roundOver";

export type BlackJackbetDenominations = 5 | 20 | 50 | 100;

export type BlackJackResultType = "Win" | "Lose" | "Push" | null;
