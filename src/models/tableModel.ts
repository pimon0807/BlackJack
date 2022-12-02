import { BlackJackActionType, BlackJackbetDenominations, BlackJackGamePhaseType, BlackJackStatusType} from "../config/blackJackConfig";
import { BlackJackDeck } from "./deckModel";
import { BlackJackPlayer, GameDecision } from "./playerModel";

export class BlackJackTable {
    public gameType: string;
    public betDenominations: BlackJackbetDenominations[];
    public deck: BlackJackDeck;
    public players: BlackJackPlayer[];
    public house: BlackJackPlayer;
    public resultLog: string[];
    public turnCounter: number;
    public roundCounter: number;
    public gamePhase: BlackJackGamePhaseType;

    constructor(public playerName: string){
        this.gameType = "blackjack";
        this.betDenominations = [5,20,50,100];
        this.deck = new BlackJackDeck(this.gameType);
        this.house = new BlackJackPlayer("Dealer", "house");
        this.resultLog = [];
        this.turnCounter = 0;
        this.roundCounter = 1;
        this.gamePhase = "betting";
        this.players = [this.house];
        this.setplayer(playerName);
    }

    setplayer(name: string): void {
        this.players.push(new BlackJackPlayer(name, "user"));
        this.players.push(new BlackJackPlayer("AI1", "ai"));
        this.players.push(new BlackJackPlayer("AI2", "ai"));
    }

    evaluateMove(decision: GameDecision) :void{
        //TODO: ここから挙動をコードしてください。
        let player = this.getTurnPlayer()

        if(player.getHandScore() === 21){
            player.status = "blackjack";
            if(player.playerType === "house"){
                player.status = "stand";
            }
            return;
        }

        if(decision.action === "bet"){
            player.betAmount = decision.amount!;
            player.winAmount = decision.amount!;
            player.status = "wait";
        }else if(decision.action === "hit" || decision.action === "double"){
            player.status = decision.action;
            player.hand.push(this.deck.drawOne()!)
            let currHandScore = player.getHandScore();
            if(decision.action === "double"){
                player.betAmount *= 2;
                player.winAmount *= 2;
            }
            if(currHandScore === 21){
                player.status = "blackjack";
            }else if(currHandScore > 21){
                player.status = "bust";
            }
            if(player.playerType === "house"){
                player.status = "stand";
            }

        }else if(decision.action === "surrender"){
            player.winAmount /= 2;
            player.status = "surrender";
        }else if(decision.action === "stand"){
            player.status = "stand";
        }else if(decision.action === "wait"){
            player.status = "wait";
        }
    }

    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults(): void{
        //TODO: ここから挙動をコードしてください。
        for(let player of this.players){
            if(player.playerType === "house"){
                if(player.getHandScore() > 21){
                    player.status = "bust"
                }else if(player.getHandScore() === 21){
                    player.status = "blackjack";
                }
                continue;
            }else{
                if(player.status === "surrender"){
                    player.chips -= player.winAmount;
                    player.result = "Lose";
                    this.resultLog.push(`${player.name} is surrender. Total chips: ${player.chips}.`)
                }else if(this.house.status === "blackjack"){
                    if(player.status === "blackjack"){
                        player.result = "Push"
                        this.resultLog.push(`${player.name} is push. ${player.chips}.`)
                    }else{
                        player.chips -= player.betAmount;
                        player.result = "Lose";
                        this.resultLog.push(`${player.name} is lose -${player.betAmount} chips. Total chips: ${player.chips}.`)
                    }
                }else if(this.house.status === "bust"){
                    if(player.status !== "bust"){
                        player.betAmount = player.status === "blackjack" ? player.betAmount * 1.5 : player.betAmount;
                        player.chips += player.betAmount;
                        player.result = "Win";
                        this.resultLog.push(`${player.name} is win +${player.betAmount} chips. Total chips: ${player.chips}.`)
                    }else{
                        player.result = "Push";
                        this.resultLog.push(`${player.name} is push. Total chips: ${player.chips}.`)
                    }
                }else{
                    if(this.house.getHandScore() === player.getHandScore()){
                        player.result = "Push";
                        this.resultLog.push(`${player.name} is push. Total chips: ${player.chips}.`)
                    }else if(this.house.getHandScore() > player.getHandScore() || player.status === "bust"){
                        player.chips -= player.betAmount;
                        player.result = "Lose";
                        this.resultLog.push(`${player.name} is lose -${player.betAmount} chips. Total chips: ${player.chips}.`)
                    }else{
                        player.betAmount = player.status === "blackjack" ? player.betAmount * 1.5 : player.betAmount;
                        player.chips += player.betAmount;
                        player.result = "Win";
                        this.resultLog.push(`${player.name} is win +${player.betAmount} chips. Total chips: ${player.chips}.`)
                    }
                }
            }
        }
    }
    
    /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
    blackjackAssignPlayerHands(): void {
        for(let player of this.players){
            if(player.playerType === "house"){
                this.house.status === "wait";
                player.hand.push(this.deck.drawOne()!);
                let faceDownCard: string = player.hand[0].suit + player.hand[0].rank;
                console.log(faceDownCard);
                player.hand.push(this.deck.drawOne()!);
            }else{
                player.hand.push(this.deck.drawOne()!);
                player.hand.push(this.deck.drawOne()!);
            }
        }
    }


    /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets(): void {
        //TODO: ここから挙動をコードしてください。
        this.roundCounter += 1;
        this.turnCounter = 0;
        this.resultLog = [];
        this.gamePhase = "betting";
        this.deck = new BlackJackDeck("blackjack");

        for(let player of this.players){
            player.status = "bet";
            player.hand = [];
            player.betAmount = 0;
        }
    }
    
    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer(): BlackJackPlayer {
        return this.players[this.turnCounter % this.players.length];
    }

    /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData?: number | BlackJackActionType) {
        //TODO: ここから挙動をコードしてください。
        if(this.gamePhase === "evaluatingWinners" && this.players[1].chips > 0){
            this.gamePhase = "roundOver";
            return;
        }else if(this.players[1].chips === 0){
            this.gamePhase = "gameOver";
            return;
        }

        if(this.allPlayerActionsResolved()){
            this.gamePhase = "evaluatingWinners";
            this.blackjackEvaluateAndGetRoundResults();
        }

        let currPlayer = this.getTurnPlayer();
        if(!(currPlayer.status === "blackjack" || currPlayer.status === "bust")){
            this.evaluateMove(currPlayer.promptPlayer(userData)!);
        }
        
        if(this.onLastPlayer() && this.gamePhase === "betting"){
            this.gamePhase = "acting";
            this.blackjackAssignPlayerHands();
        }
        this.turnCounter++;
    }

    onFirstPlayer(): boolean {
        return this.turnCounter % this.players.length === 0;
    }

    onLastPlayer(): boolean {
        return this.turnCounter % this.players.length === this.players.length - 1;
    }
    
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved(): boolean {
        let statusList = ["broken", "surrender", "bust", "stand", "blackjack", "double"];
        for(let player of this.players){
            if(!statusList.includes(player.status)){
                return false;
            }
        }
        return true;
    }
}
