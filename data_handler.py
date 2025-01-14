import persistence


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)

def save_board(data):
    persistence.save_board(data)

def save_card(data):
    order = int(persistence.cards_last_order_in_column(data["status_id"],data["board_id"])["last_order"])+1
    persistence.save_card(data,order)

def last_id(table):
    return persistence.last_id(table)

def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            #card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards

def save_changes(data):
    persistence.save_changes(data)

def edit_card(data):
    persistence.edit_card(data)

def edit_board(data):
    persistence.edit_board(data)

def delete_board(board_id):
    persistence.delete_data_by_id("board",board_id)



def delete_card(card_id):
    persistence.delete_data_by_id("card",card_id)


def save_orders(data_list):
    for card in data_list:
        persistence.update_card_order(card["cardId"],card["order"])