import e from "express";
import { BlackJackbetDenominations } from "../config/blackJackConfig";
import { Controller } from "../controllers/blackJackController";
import { BlackJackCard } from "../models/cardModel";
import { BlackJackPlayer } from "../models/playerModel";
import { BlackJackTable } from "../models/tableModel";

export class View {
    static createInitialPage() {
        console.log("initial");
        let container = document.createElement("div");
        container.classList.add("vh-100", "d-flex", "flex-column", "justify-content-center", "align-items-center", "bg-success", "text-center");
        container.innerHTML = `
        <h1>BlackJack & Poker</h1>
        <h3>Select Game and Input Your Name!</h3>
        <div class="col-4 mt-4">
                <div class="radio">
                    <label>
                        <input type="radio" name="gameType" value="blackjack"> <span>BlackJack</span>
                    </label>
                </div>
                <div class="radio mt-3">
                    <label>
                        <input type="radio" name="gameType" value="poker"> <span>Poker</span>
                    </label>
                </div>
                <div class="my-4">
                    <input id="userName" type="text" class="form-control" placeholder="Player Name">
                </div>
        </div>
        <div class="col-6">
            <p id="gameStartBtn" class="dbtn">Game Start</p>
        </div>
        `;
        return document.getElementById("root")?.append(container);
    }

    static createMainPage(table: BlackJackTable) {
        let container = document.createElement("div");
        container.classList.add("vh-100", "bg-success", "d-flex", "justify-content-center", "align-items-center");
        container.innerHTML = `
        <div class="col-12">
            <div class="pt-5 container">
                <h3 class="m-0 text-center text-white rem3">Dealer</h3>
                <p id="housestatus" class="text-center">status: ${table.house.status}</p>

                <div id="${table.players[0].name}" class="justify-content-center pt-3 pb-5 row">
                    <div class="col-3 justify-content-center row">
                        ${View.createCardView(table.players[0])}
                    </div>
                </div>

                <div class="">
                    <div id="playersDiv" class="d-flex justify-content-between">
                        
                        <div id="${table.players[2]}" class="col-3">
                            <h3 class="m-0 text-white text-center rem3">${table.players[2].name}</h3>
                            <p id="player2status" class="text-center">status: ${table.players[2].status}</p>
                            <p class="text-center">bet: ${table.players[2].betAmount}</p>
                            <p class="text-center">chip: ${table.players[2].chips}</p>
                            <div class="d-flex justify-content-center row">
                                ${View.createCardView(table.players[2])}
                            </div>
                        </div>
                        
                        
                        <div id="player1info" class="col-3">
                            <h3 class="m-0 text-white text-center rem3">${table.players[1].name}</h3>
                            <p id="player1status" class="text-center">status: ${table.players[1].status}</p>
                            <p class="text-center">bet: ${table.players[1].betAmount}</p>
                            <p class="text-center">chip: ${table.players[1].chips}</p>
                            <div class="d-flex justify-content-center row">
                                ${View.createCardView(table.players[1])}
                            </div>
                        </div>
                        
                        
                        <div id="${table.players[3]}" class="col-3">
                            <h3 class="m-0 text-white text-center rem3">${table.players[3].name}</h3>
                            <p id="player3status" class="text-center">status: ${table.players[3].status}</p>
                            <p class="text-center">bet: ${table.players[3].betAmount}</p>
                            <p class="text-center">chip: ${table.players[3].chips}</p>
                            <div class="d-flex justify-content-center row">
                                ${View.createCardView(table.players[3])}
                            </div>
                        </div>

                    </div>
                </div>
                <div id="playerArea" class="d-flex justify-content-center mt-5">
                </div>
            </div>
        </div>`;

        return document.getElementById("root")?.append(container);
    }

    static createBetPhase(table: BlackJackTable) {
        let container = document.createElement("div");
        container.innerHTML = `
        <div id="betamount">
            <h4>Your Bet ${table.players[1].betAmount}</h4>
        </div>
        <div id="chips" class="d-flex align-items-center">
        </div>
        <div class="d-grid col-12 my-4">
            <button id="betbtn" class="btn btn-primary" disabled>ok</button>
            <button id="resetbetbtn" class="btn btn-danger mt-2">Reset</button>
        </div>
        `;

        for(let chip of table.betDenominations){
            let chipBtn = document.createElement("div");
            chipBtn.innerHTML = `
            <button id="${chip}" type="button" class="btn btn-warning btn-circle mx-4" value=${chip}>${chip}</button>
            </button>
            `;
            chipBtn.addEventListener("click", () => {
                document.querySelectorAll("#betamount")[0].innerHTML = `<h4>Your Bet ${table.players[1].betAmount}</h4>`;
            })
            container.querySelectorAll("#chips")[0].append(chipBtn);
        }

        return document.getElementById("playerArea")?.append(container);
    }

    static createActionPhase(table: BlackJackTable) {
        let container = document.createElement("div");
        container.innerHTML = `
        <div id="actions" class="d-flex align-items-center">
        </div>
        `
        for(let action of table.getTurnPlayer().actions){
            let actionBtn = document.createElement("div");
            actionBtn.innerHTML = `
            <button id="${action}" type="button" class="btn btn-warning btn-circle mx-4" value=${action}>${action}</button>
            `;
            container.querySelectorAll("#actions")[0].append(actionBtn);
        }

        return document.getElementById("playerArea")?.append(container);
    }

    static createCardView(player: BlackJackPlayer) {
            let container = document.createElement("div");
            for(let card of player.hand){
                container.innerHTML += `
                <div id="${card.suit + card.rank}" class="border text-center m-2 w-15 bg-white">
                    <div>
                    </div>
                    <div>
                        <p>${card.rank}</p>
                    </div>
                </div>
                `
                if(card.suit === "H"){
                    container.querySelectorAll(`#${card.suit + card.rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♥️</p>`;
                }else if(card.suit === "D"){
                    container.querySelectorAll(`#${card.suit + card.rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♦️</p>`;
                }else if(card.suit === "C"){
                    container.querySelectorAll(`#${card.suit + card.rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♣️</p>`;
                }else if(card.suit === "S"){
                    container.querySelectorAll(`#${card.suit + card.rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♠️</p>`;
                }
            }

            return container.innerHTML;
    }

    static faceDownCard(table: BlackJackTable){
        let faceDownCard: string = table.house.hand[0].suit + table.house.hand[0].rank;
        document.querySelectorAll(`#${faceDownCard}`)[0].innerHTML = `<i class="fa-solid fa-question fa-2x"></i>`;
    }

    static faceUpCard(table: BlackJackTable){
        let faceUpCard: string = table.house.hand[0].suit + table.house.hand[0].rank;

        document.querySelectorAll(`#${faceUpCard}`)[0].innerHTML = `
            <div>
                <p>${table.house.hand[0].suit}</p>
            </div>
            <div>
                <p>${table.house.hand[0].rank}</p>
            </div>
        `;
        if(table.house.hand[0].suit === "H"){
            document.querySelectorAll(`#${table.house.hand[0].suit + table.house.hand[0].rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♥️</p>`;
        }else if(table.house.hand[0].suit === "D"){
            document.querySelectorAll(`#${table.house.hand[0].suit + table.house.hand[0].rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♦️</p>`;
        }else if(table.house.hand[0].suit === "C"){
            document.querySelectorAll(`#${table.house.hand[0].suit + table.house.hand[0].rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♣️</p>`;
        }else if(table.house.hand[0].suit === "S"){
            document.querySelectorAll(`#${table.house.hand[0].suit + table.house.hand[0].rank}`)[0].querySelectorAll("div")[0].innerHTML = `<p>♠️</p>`;
        }

    }

    static createResultModal(table: BlackJackTable){
        let container = document.createElement("div");
        container.innerHTML = `
        <div id="resultmodal" class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Round ${table.roundCounter}</h5>
                    </div>
                    <div class="modal-body">
                        <p>${table.resultLog[0]}</p>
                        <p>${table.resultLog[1]}</p>
                        <p>${table.resultLog[2]}</p>
                    </div>
                    <div class="modal-footer">
                        <button id="nextround" type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `
        return document.getElementById("root")?.append(container);
    }

    static createGameOverModal() {
        let container = document.createElement("div");
        container.innerHTML = `
        <div id="gameovermodal" class="modal" tabindex="1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>Game Over</h5>
                    </div>
                    <div class="modal-body">
                        <p>You are Bust Out.
                    </div>
                    <div class="modal-footer">
                        <button id="newgame" type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
        `
        return document.getElementById("root")?.append(container);
    }

    static createNewGameBtn(chip: number){

        let status = chip > 0 ? "Next Round" : "New Game";

        let container = document.createElement("div");
        container.innerHTML = `
        <button id=${status} type="button" class="btn btn-primary ">${status}</button>
        `;

        return document.getElementById("playerArea")?.append(container);
    }

    static disabledSecondActionBtn(table: BlackJackTable){
        
        let doubleBtn = document.getElementById("double") as HTMLInputElement;
        doubleBtn.disabled = true;

        let surrenderBtn = document.getElementById("surrender") as HTMLInputElement;
        surrenderBtn.disabled = true;

    }

    static displayResult(player: BlackJackPlayer) {
        let result = player.result;
        let container = document.createElement("div");
        container.classList.add("text-center");
        container.innerHTML = `
        <h2>${result}</h2>
        `;
        return document.getElementById("player1info")?.append(container);
    }
}