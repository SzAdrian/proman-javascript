// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        document.getElementById("createboard").addEventListener("click", this.newBoard);

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });

    },
    loadButtons: function () {
        let deleteboardbuttons = document.querySelectorAll('.deleteboardbutton > button');
        for (let button of deleteboardbuttons) {
            button.addEventListener("click", function () {
                dataHandler.deleteBoard(button.dataset["boardId"], dom.deleteBoardHTML)
            });
        }

        let createCardbuttons = document.querySelectorAll(".board-column-title.pl-4 > button");
        for (let button of createCardbuttons) {
            button.addEventListener("click", function () {
                let newCard = dom.cardTemplate("newCard", "NewCard", "BoardId", "Status");
                let inputfield = `<input type="text" autofocus placeholder="New Card" required class="bg-transparent text-white border-0 input-sm">`;
                document.querySelector(`#board-column-content-${button.dataset["boardId"]}-${button.dataset["status_id"]}`).insertAdjacentHTML("beforeend", newCard);
                document.querySelector("#newCard").innerHTML = inputfield;
                document.querySelector("#newCard> input").addEventListener("blur", function () {
                    dataHandler.createNewCard(this.value, button.dataset["boardId"], button.dataset["status_id"], dom.switchCards)
                })
            })
        }

        let cardRemoveButtons = document.querySelectorAll(".card-remove");
        for (let button of cardRemoveButtons) {
            button.addEventListener("click", function () {
                dataHandler.deleteCard(button.dataset["cardId"], dom.deleteCardHTML)
            })
        }
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardList = '';

        for (let board of boards) {
            boardList += this.boardTemplate(board.title, board.id);
        }

        let boardsContainer = document.getElementById('board-container');
        document.querySelector(".loading").remove();
        boardsContainer.insertAdjacentHTML("beforeend", boardList);

    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        dataHandler.getCards(dom.showCards)
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            let cardTemplate = dom.cardTemplate(card.id, card.title, card.board_id, card.status_id);
            document.querySelector(`#board-column-content-${card.board_id}-${card.status_id}`).insertAdjacentHTML("beforeend", cardTemplate);
        }
        dom.loadButtons();
        dom.addDragula();

    },
    // here comes more features
    newBoard: function () {
        let newboard = dom.boardTemplate("New Board", "newBoard");
        let inputfield = `<input type="text" autofocus placeholder="New Board" required class="bg-transparent text-white border-0">`;
        document.getElementById("board-container").insertAdjacentHTML("beforeend", newboard);
        document.querySelector("#board-title-newBoard > p").innerHTML = inputfield;
        document.querySelector("#board-title-newBoard > p > input").addEventListener("blur", function () {
            dataHandler.createNewBoard(this.value, dom.switchBoards)
        })
    },
    boardTemplate: function (BoardTitle, boardID) {
        return `<div id=board-id-${boardID} class="card">
    <h5 class="card-header d-inline">
        <a id="board-title-${boardID}" data-toggle="collapse" href="#collapse-${boardID}" aria-expanded="true" aria-controls="collapse-${boardID}"
           id="heading-example" class="d-inline-block text-decoration-none">
            <i class="fa fa-chevron-down px-2"></i><p class="d-inline">${BoardTitle}</p>
            
             
        </a><div class="deleteboardbutton d-inline"><button class="btn btn-sm btn-danger float-right font-weight-bold" data-board-id="${boardID}"><i class="fas fa-trash-alt"></i>  Delete</button></div>
    </h5>
    <div id="collapse-${boardID}" class="collapse show" aria-labelledby="heading-example">
        <div class="card-body">
            <div class="board-columns">
                <div class="board-column">
                    <div class="board-column-title pl-4">New<button class="text-white float-right btn outline-none mt-n1" data-board-id="${boardID}" data-status_id="0">+</button></div>
                    <div class="board-column-content" id="board-column-content-${boardID}-0"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title pl-4">In Progress<button class="text-white float-right btn outline-none mt-n1" data-board-id="${boardID}" data-status_id="1">+</button></div>
                    <div class="board-column-content"  id="board-column-content-${boardID}-1"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title pl-4">Testing<button class="text-white float-right btn outline-none mt-n1" data-board-id="${boardID}" data-status_id="2">+</button></div>
                    <div  class="board-column-content" id="board-column-content-${boardID}-2"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title pl-4">Done<button class="text-white float-right btn outline-none mt-n1" data-board-id="${boardID}" data-status_id="3">+</button></div>
                    <div  class="board-column-content" id="board-column-content-${boardID}-3"></div>
                </div>
            </div>
        </div>
    </div>
</div>`
    },
    switchBoards: function (resp) {
        document.getElementById("board-id-newBoard").remove();
        document.querySelector("#board-container").insertAdjacentHTML("beforeend", dom.boardTemplate(resp.title, resp.id));
        document.querySelector(`[data-board-id = "${resp.id}"]`).addEventListener("click", function () {
            dataHandler.deleteBoard(resp.id, dom.deleteBoardHTML)
        });
        let addNewCardButtons = document.querySelectorAll(`#collapse-${resp.id}> div > div > div > div.board-column-title.pl-4 > button`);
        for (let button of addNewCardButtons) {
            button.addEventListener("click", function () {
                let newCard = dom.cardTemplate("newCard", "NewCard", "BoardId", "Status");
                let inputfield = `<input type="text" autofocus placeholder="New Card" required class="bg-transparent text-white border-0 input-sm">`;
                document.querySelector(`#board-column-content-${button.dataset["boardId"]}-${button.dataset["status_id"]}`).insertAdjacentHTML("beforeend", newCard);
                document.querySelector("#newCard").innerHTML = inputfield;
                document.querySelector("#newCard> input").addEventListener("blur", function () {
                    dataHandler.createNewCard(this.value, button.dataset["boardId"], button.dataset["status_id"], dom.switchCards)
                })
            })
        }

    },
    deleteBoardHTML: function (resp) {
        let boardId = resp["board_id"];
        document.querySelector(`#board-id-${boardId}`).remove()
    },
    addDragula: function () {
        dragula(Array.from(document.getElementsByClassName("board-column-content")));
    },
    addEditBoardTitle: function () {
        //not working
        let boardtitles = document.querySelectorAll(".card-header > p");
        console.log(boardtitles);
        for (let title of boardtitles) {
            title.addEventListener("dblclick", function () {
                let inputfield = `<input type="text" autofocus placeholder="${title.textContent}" required class="bg-transparent text-white border-0">`;
                console.log(this);
                document.querySelector("#board-title-newBoard > p").innerHTML = inputfield;
                document.querySelector("#board-title-newBoard > input").addEventListener("blur", function () {

                })
            })

        }
    },
    cardTemplate: function (cardId, cardTitle, boardId, status) {
        return `<div id="card-id-${cardId}" class="card">
              <div data-card-id="${cardId}" class="card-remove"><i class="fas fa-trash-alt"></i></div>
              <div id="${cardId}" data-board-id =${boardId} data-status = ${status} class="card-title">${cardTitle}</div>
         </div>`
    },


    switchCards: function (resp) {
        document.querySelector("#card-id-newCard").remove();
        document.querySelector(`#board-column-content-${resp.board_id}-${resp.status_id}`).insertAdjacentHTML("beforeend", dom.cardTemplate(resp.id, resp.title, resp.board_id, resp.status_id));
        document.querySelector(`#card-id-${resp.id} > div.card-remove`).addEventListener("click", function () {
            dataHandler.deleteCard(resp.id, dom.deleteCardHTML)
        });
    },
    deleteCardHTML: function (resp) {
        let cardId = resp["card_id"];
        document.querySelector(`#card-id-${cardId}`).remove()
    }
};
