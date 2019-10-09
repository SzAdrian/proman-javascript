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
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardList = '';

        for (let board of boards) {
            boardList += this.boardTemplate(board.title, board.id);
        }

        let boardsContainer = document.getElementById('board-container');
        boardsContainer.innerHTML = boardList;

    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        dataHandler.getCards(dom.showCards)
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            let cardTemplate = `<div class="card">
              <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
              <div class="card-title">${card.title}</div>
         </div>`;
            document.querySelector(`#board-column-content-${card.board_id}-${card.status_id}`).insertAdjacentHTML("beforeend", cardTemplate);
        }
        dom.loadButtons()
    },
    // here comes more features
    newBoard: function () {

        let newboard = dom.boardTemplate("New Board", "newBoard");
        let inputfield = `<input type="text" autofocus placeholder="New Board" required class="bg-transparent text-white border-0">`;
        document.getElementById("board-container").insertAdjacentHTML("beforeend", newboard);
        document.getElementById("board-title-newBoard").innerHTML = inputfield;
        document.querySelector("#board-title-newBoard > input").addEventListener("blur", function () {
            dataHandler.createNewBoard(this.value, dom.switchBoards)
        })


    },
    boardTemplate: function (BoardTitle, boardID) {
        return `<div id=board-id-${boardID} class="card">
    <h5 class="card-header">
        <a id="board-title-${boardID}" data-toggle="collapse" href="#collapse-${boardID}" aria-expanded="true" aria-controls="collapse-${boardID}"
           id="heading-example" class="d-block text-decoration-none">
            <i class="fa fa-chevron-down pull-right"></i>
            ${BoardTitle}
             
        </a><div class="deleteboardbutton"><button class="btn btn-sm btn-danger" data-board-id="${boardID}"><i class="fas fa-trash-alt"></i>  Delete Board</button></div>
    </h5>
    <div id="collapse-${boardID}" class="collapse show" aria-labelledby="heading-example">
        <div class="card-body">
            <div class="board-columns">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content" id="board-column-content-${boardID}-0"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">In Progress</div>
                    <div class="board-column-content"  id="board-column-content-${boardID}-1"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div  class="board-column-content" id="board-column-content-${boardID}-2"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Done</div>
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

        })

    },
    deleteBoardHTML: function (resp) {
        let boardId = resp["board_id"];
        document.querySelector(`#board-id-${boardId}`).remove()
    }
};
