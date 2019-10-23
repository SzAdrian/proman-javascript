from flask import Flask, render_template, url_for, request
from util import json_response
import persistence
import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards")
@json_response
def get_cards():
    return persistence.read_table("card")


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/createNewBoard", methods=["POST"])
@json_response
def create_new_board():
    data = request.json
    response = {}
    data_handler.save_board(data)
    response["id"] = data_handler.last_id("board")["max"]
    response["title"] = data["title"]
    return response


@app.route("/delete-board", methods=["POST"])
@json_response
def delet_board():
    data = request.json
    data_handler.delete_board(int(data["board_id"]))
    return data

@app.route("/createNewCard", methods=["POST"])
@json_response
def create_new_card():
    data = request.json
    response = {}
    data_handler.save_card(data)
    response["id"] = data_handler.last_id("card")["max"]
    response["title"] = data["title"]
    response["board_id"] = data["board_id"]
    response["status_id"] = data["status_id"]
    return response


@app.route("/delete-card", methods=["POST"])
@json_response
def delete_card():
    data = request.json
    data_handler.delete_card(int(data["card_id"]))
    return data

@app.route("/save-changes",methods=["POST"])
@json_response
def route_save_changes():
    data = request.json
    data_handler.save_changes(data)
    return {"response_text":"Saved!"}

@app.route("/edit-card",methods=["POST"])
@json_response
def route_edit_card():
    data = request.json
    data_handler.edit_card(data)
    return {"response_text":"Saved!"}

@app.route("/edit-board", methods=["POST"])
@json_response
def route_edit_board():
    data = request.json
    data_handler.edit_board(data)
    return {"response_text":"Saved!"}

def main():
    pass


if __name__ == '__main__':
    app.run(
        host="10.44.12.70",
        port=5000,
    )