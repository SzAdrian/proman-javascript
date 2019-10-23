// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(
                data
            )
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object

    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCards: function (callback){
        this._api_get(`/get-cards`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        let data = {"title": boardTitle};
        this._api_post('/createNewBoard', data, (response) => {
            callback(response)
        })
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let data = {"title": cardTitle,"board_id": boardId,"status_id":statusId};
        this._api_post('/createNewCard', data, (response) => {
            callback(response)
        })
    },
    deleteBoard: function (boardId,callback) {
        let data = {"board_id":boardId};
        this._api_post('/delete-board', data, (response) => {
            callback(response)
        })
    },
    deleteCard: function (cardId,callback) {
        let data = {"card_id":cardId};
        this._api_post('/delete-card',data,(response) => {
            callback(response)
        })
    },
    save: function (cardId,newColumnId,callback) {
        let data = {"card_id": cardId, "new_column_id": newColumnId};
        this._api_post("/save-changes", data, (response) => {
            callback(response.response_text)
        })
    },
    editCard: function (cardTitle,cardId,callback) {
        let data = {"card_title":cardTitle, "card_id":cardId};
        this._api_post("/edit-card",data,(response) => {
            callback(response.response_text)
        })
    },
    editBoard: function (boardTitle,boardId, callback, callback2) {
        let data = {"boardTitle": boardTitle, "boardId": boardId};
        this._api_post("/edit-board", data, (response) => {
            callback(response.response_text);
            callback2()
        } )
    }
    // here comes more features
};
