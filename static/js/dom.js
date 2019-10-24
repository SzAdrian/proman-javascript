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
            let deleteboardbuttons = document.querySelectorAll('a.deleteboardbutton');
            for (let button of deleteboardbuttons) {
                button.addEventListener("click", function () {
                    document.querySelector(`#board-id-${button.dataset["boardId"]}`).classList.add("animated", "bounceOutLeft");
                    setTimeout(function () {
                        dataHandler.deleteBoard(button.dataset["boardId"], dom.deleteBoardHTML)
                    }, 550);
                });
            }
            let boardEditButtons = document.querySelectorAll(".editBoardButton");
            for (let button of boardEditButtons) {
                button.addEventListener("click", function () {
                    dom.editBoard.call(button)
                })
            }

            //almost same code used at line 127
            let createCardbuttons = document.querySelectorAll(".board-column-title.pl-4 > button");
            for (let button of createCardbuttons) {
                button.addEventListener("click", function () {
                        if (document.querySelector("#newCard")) {
                            document.querySelector("#card-id-newCard").remove()
                        }
                        let newCard = dom.cardTemplate("newCard", "NewCard", "BoardId", "Status");
                        let inputfield = `<input type="text" placeholder="New Card" autofocus required class="bg-transparent text-white border-0 input-sm">`;
                        document.querySelector(`#board-column-content-${button.dataset["boardId"]}-${button.dataset["status_id"]}`).insertAdjacentHTML("beforeend", newCard);
                        document.querySelector("#newCard").innerHTML = inputfield;
                        document.querySelector("#card-id-newCard").classList.add("animated", "bounceIn");
                        document.querySelector("#newCard > input").addEventListener("blur", function () {
                            if (document.querySelector("#newCard > input").value === "") {
                                document.querySelector("#card-id-newCard").remove()
                            } else {
                                dataHandler.createNewCard(this.value, button.dataset["boardId"], button.dataset["status_id"], dom.switchCards)
                            }
                        })
                    }
                )
            }
            let cardEditButtons = document.querySelectorAll(".card-edit");
            cardEditButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    dom.editCard(button.parentElement.id.slice(8))
                })
            });


            let cardRemoveButtons = document.querySelectorAll(".card-remove");
            for (let button of cardRemoveButtons) {
                button.addEventListener("click", function () {
                    button.parentElement.classList.add("animated", "bounceOut");
                    setTimeout(function () {
                        dataHandler.deleteCard(button.dataset["cardId"], dom.deleteCardHTML)
                    }, 700);

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

        }
        ,
        loadCards: function () {
            // retrieves cards and makes showCards called
            dataHandler.getCards(dom.showCards)
        }
        ,
        showCards: function (cards) {
            // shows the cards of a board
            // it adds necessary event listeners also
            for (let card of cards) {
                let cardTemplate = dom.cardTemplate(card.id, card.title, card.board_id, card.status_id);
                document.querySelector(`#board-column-content-${card.board_id}-${card.status_id}`).insertAdjacentHTML("beforeend", cardTemplate);
                document.querySelector(`#card-id-${card.id} > .card-title > input`).addEventListener("blur", function () {
                    dataHandler.editCard(this.value, card.id, dom.alert)
                })
            }
            dom.loadButtons();
            dom.addDragula();
            dom.updateBadgeCount()

        }
        ,
// here comes more features
        newBoard: function () {
            document.querySelector("#createboard").disabled = true;
            let newboard = dom.boardTemplate("New Board", "newBoard");
            let inputfield = `<input type="text" autofocus placeholder="New Board" required class="bg-transparent text-white border-0">`;
            document.getElementById("board-container").insertAdjacentHTML("beforeend", newboard);
            dom.updateBadgeCount();
            document.querySelector(`#board-id-newBoard`).classList.add("animated", "bounceInLeft");
            setTimeout(function () {
                document.querySelector("#board-title-newBoard > p").innerHTML = inputfield;
                document.querySelector("#board-title-newBoard > p > input").addEventListener("blur", function () {
                    if (document.querySelector("#board-title-newBoard > p > input").value === "") {
                        document.querySelector("#board-id-newBoard").classList.add("animated", "bounceOutLeft");
                        setTimeout(function () {
                            document.querySelector("#board-id-newBoard").remove()
                        }, 500);
                        document.querySelector("#createboard").disabled = false;
                    } else {
                        dataHandler.createNewBoard(this.value, dom.switchBoards)
                    }
                }, 500);

            });
        }
        ,
        boardTemplate: function (BoardTitle, boardID) {
            return `<div id=board-id-${boardID} class="card board">
    <h5 class="card-header d-inline">
        <a id="board-title-${boardID}" data-toggle="collapse" href="#collapse-${boardID}" aria-expanded="true" aria-controls="collapse-${boardID}"
           id="heading-example" class="d-inline-block text-decoration-none collapsed">
            <i class="fa fa-chevron-down px-2"></i><p class="d-inline font-weight-bold">${BoardTitle}</p>
        </a>
        <span id=badge-${boardID} class="badge badge-pill badge-warning mx-2"></span>
        <div class="btn-group dropright float-right"><button type="button" class="btn text-white float-right rounded-circle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-h"></i></button>
            <div class="dropdown-menu shadow-lg p-2">
            <!-- Dropdown menu links -->
                <a data-board-id="${boardID}" class="deleteboardbutton dropdown-item bg-danger text-white btn btn-danger btn-sm  py-2 text-center my-1" href="#"><div class=" d-inline"><div class="font-weight-bold m-0" ><i class="fas fa-trash-alt pr-2"></i>Delete</div></div></a>
                <a data-board-id="${boardID}" class="editBoardButton dropdown-item bg-info text-white btn btn-info btn-sm py-2  text-center my-1 " href="#"><div class="d-inline"><div class="font-weight-bold m-0" ><i class="fas fa-edit pr-2"></i>Edit</div></div></a>
            </div>
    </h5>
    <div id="collapse-${boardID}" class="collapse" aria-labelledby="heading-example">
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
        }
        ,
        switchBoards: function (resp) {
            document.querySelector("#createboard").disabled = false;
            document.getElementById("board-id-newBoard").remove();
            document.querySelector("#board-container").insertAdjacentHTML("beforeend", dom.boardTemplate(resp.title, resp.id));
            dom.updateBadgeCount();
            document.querySelector(`[data-board-id = "${resp.id}"]`).addEventListener("click", function () {
                document.querySelector(`#board-id-${resp.id}`).classList.add("animated", "bounceOutLeft");
                setTimeout(function () {
                    dataHandler.deleteBoard(resp.id, dom.deleteBoardHTML)
                }, 500);

            });
            //put this into a 'insertInputfield' function
            let addNewCardButtons = document.querySelectorAll(`#collapse-${resp.id}> div > div > div > div.board-column-title.pl-4 > button`);
            for (let button of addNewCardButtons) {
                button.addEventListener("click", function () {
                    if (document.querySelector("#newCard")) {
                        document.querySelector("#card-id-newCard").remove()
                    }
                    let newCard = dom.cardTemplate("newCard", "NewCard", "BoardId", "Status");
                    // let inputfield -> inputfieldTemplate func
                    let inputfield = `<input type="text" placeholder="New Card" required class="bg-transparent text-white border-0 input-sm">`;
                    document.querySelector(`#board-column-content-${button.dataset["boardId"]}-${button.dataset["status_id"]}`).insertAdjacentHTML("beforeend", newCard);
                    document.querySelector("#card-id-newCard").classList.add("animated", "bounceIn");
                    document.querySelector("#newCard").innerHTML = inputfield;
                    document.querySelector("#newCard> input").addEventListener("blur", function () {
                        dataHandler.createNewCard(this.value, button.dataset["boardId"], button.dataset["status_id"], dom.switchCards)
                    })
                })
            }
            document.querySelector(`#board-id-${resp.id}.board`).querySelector(".editBoardButton").addEventListener("click", function () {
                dom.editBoard.call(this)
            });

            dragula(Array.from(document.querySelector(`#board-id-${resp.id}`).querySelectorAll(".board-column-content"))).on("drop", function (element) {
                let newColumnId = element.parentElement.id.slice(-1);
                let cardId = element.id.slice(8);
                dataHandler.saveDragnDrop(cardId, newColumnId, dom.alert);
                dom.updateOrder()
            });
            dom.alert("Saved!");
        }
        ,
        deleteBoardHTML: function (resp) {
            let boardId = resp["board_id"];
            document.querySelector(`#board-id-${boardId}`).remove()
        }
        ,
        addDragula: function () {
            for (let board of document.querySelectorAll(".board")) {
                dragula(Array.from(board.querySelectorAll(".board-column-content"))).on("drop", function (element) {
                    let newColumnId = element.parentElement.id.slice(-1);
                    let cardId = element.id.slice(8);
                    dataHandler.saveDragnDrop(cardId, newColumnId, dom.alert);
                    dom.updateOrder(element.offsetParent.id.slice(9))
                });
            }

        }
        ,


        editBoard: function () {
            let boardTitle = document.querySelector(`#board-title-${this.dataset["boardId"]}`).textContent.trim();
            let boardId = this.dataset["boardId"];
            let inputfield = `<input type="text" maxlength="20" autofocus value="${boardTitle}" required class="bg-transparent text-white border-0 input-sm">`;
            document.querySelector(`#board-title-${this.dataset["boardId"]}`).innerHTML = inputfield;
            document.querySelector(`#board-title-${this.dataset["boardId"]} > input`).addEventListener("blur", function () {
                boardTitle = this.value;
                dataHandler.editBoard(boardTitle, boardId, dom.alert, function () {
                    document.querySelector(`#board-title-${boardId}`).innerHTML = `<i class="fa fa-chevron-down px-2"></i><p class="d-inline font-weight-bold">${boardTitle}</p>`
                });
            });
        }
        ,


        cardTemplate: function (cardId, cardTitle, boardId, status) {
            return `<div id="card-id-${cardId}" class="card animatebutton">
              <div data-card-id="${cardId}" class="card-remove"><i class="fa fa-times"></i></div>
              <div class="card-edit"></div>
              <div id="${cardId}" data-board-id =${boardId} data-status = ${status} class="card-title"><input type="text" maxlength="20" value="${cardTitle}" required class="bg-transparent text-white border-0 input-sm"></div>
         </div>`
        }
        ,


        switchCards: function (resp) {
            document.querySelector("#card-id-newCard").remove();
            document.querySelector(`#board-column-content-${resp.board_id}-${resp.status_id}`).insertAdjacentHTML("beforeend", dom.cardTemplate(resp.id, resp.title, resp.board_id, resp.status_id));
            document.querySelector(`#card-id-${resp.id} > div.card-remove`).addEventListener("click", function () {
                document.querySelector(`#card-id-${resp.id}`).classList.add("animated", "bounceOut");
                setTimeout(function () {
                    dataHandler.deleteCard(resp.id, dom.deleteCardHTML)
                }, 700);
            });

            document.querySelector(`#card-id-${resp.id} > .card-title > input`).addEventListener("blur", function () {
                dataHandler.editCard(this.value, resp.id, dom.alert)
            });
            dom.alert("Saved!");
            dom.updateBadgeCount()
        }
        ,
        deleteCardHTML: function (resp) {
            document.querySelector(`#card-id-${resp.card_id}`).remove();
            dom.updateBadgeCount();
        }
        ,
        alert: function (alertMessage) {
            document.querySelector("#alert").innerHTML = ` <i class="far fa-save"></i> ${alertMessage}`;
            document.querySelector("#alert").classList.toggle("hidden");
            setTimeout(function () {
                document.querySelector("#alert").classList.toggle("hidden");
            }, 1000)
        }
        ,
        editCard: function (cardId) {
            let cardTitle = document.querySelector(`#card-id-${cardId} > .card-title`).textContent;
            let inputfield = `<input type="text" maxlength="20" value="${cardTitle}" required class="bg-transparent text-white border-0 input-sm">`;
            document.querySelector(`#card-id-${cardId} > .card-title`).innerHTML = inputfield;
            document.querySelector(`#card-id-${cardId} > .card-title > input`).addEventListener("blur", function () {
                dataHandler.editCard(this.value, cardId, dom.alert)
            })
        }
        ,
        updateBadgeCount: function () {
            const allBoards = document.querySelectorAll(".board");

            allBoards.forEach(function (board) {
                let cardCount = 0;
                cardCount += board.querySelector(`#board-column-content-${board.id.slice(9)}-0`).children.length;
                cardCount += board.querySelector(`#board-column-content-${board.id.slice(9)}-1`).children.length;
                cardCount += board.querySelector(`#board-column-content-${board.id.slice(9)}-2`).children.length;
                cardCount += board.querySelector(`#board-column-content-${board.id.slice(9)}-3`).children.length;
                document.querySelector(`#badge-${board.id.slice(9)}`).textContent = cardCount;
            })
        }
        ,
        updateOrder: function (boardId) {
            let orderOfCards = [];
            const allColumns = document.querySelectorAll(`[id*= board-column-content-${boardId}-]`);
            for (let column of allColumns) {
                for (let card of column.children) {
                    let oneCardData = {
                        "cardId": card.id.slice(8),
                        "order": Array.from(column.children).indexOf(card) + 1
                    };
                    orderOfCards.push(oneCardData)
                }
            }
            dataHandler.saveOrder(orderOfCards, dom.alert)
        }
    }
;
