import csv
import connection
from psycopg2 import sql
STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        return formatted_data


@connection.connection_handler
def read_table(cursor,table):
    cursor.execute(sql.SQL("SELECT * FROM {} ORDER BY id").format(sql.Identifier(table)))
    return cursor.fetchall()

@connection.connection_handler
def last_id(cursor,table):
    cursor.execute(sql.SQL("SELECT MAX(id) FROM {}").format(sql.Identifier(table)))
    return cursor.fetchone()

@connection.connection_handler
def save_board(cursor,data):
    qdata = data['title']
    cursor.execute(sql.SQL("INSERT INTO {} ({}) VALUES ({});").format(sql.Identifier("board"), sql.Identifier('title'),sql.Literal(qdata)))

@connection.connection_handler
def save_card(cursor,data,order):
    cursor.execute(f"""INSERT INTO card (board_id,title,status_id,"order") VALUES ({data["board_id"]},'{data["title"]}',{data["status_id"]},{order})""")


def _get_data(data_type, table, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] =read_table(table)
    return _cache[data_type]


@connection.connection_handler
def delete_data_by_id(cursor,table,id):
    cursor.execute(sql.SQL("DELETE FROM {} WHERE id = {};").format(sql.Identifier(table),sql.Literal(id)))

@connection.connection_handler
def save_changes(cursor,data):
    cursor.execute("UPDATE card SET status_id= %(newcolumn)s WHERE id = %(cardid)s",{"newcolumn": data["new_column_id"],"cardid":data["card_id"]})

def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)

@connection.connection_handler
def edit_card(cursor,data):
    cursor.execute("UPDATE card SET title = %(card_title)s WHERE id = %(card_id)s",{"card_title": data["card_title"],"card_id":data["card_id"]})


@connection.connection_handler
def edit_board(cursor, data):
    cursor.execute("UPDATE board SET title = %(board_title)s WHERE id = %(board_id)s", {"board_title": data["boardTitle"], "board_id":data["boardId"]})

def get_statuses(force=False):
    return _get_data('statuses', "status", force)

@connection.connection_handler
def cards_last_order_in_column(cursor,column,board_id):
    cursor.execute(f"""SELECT COALESCE(MAX(card.order),'0') last_order FROM card WHERE status_id = {column} AND board_id = {board_id}""")
    return cursor.fetchone()

@connection.connection_handler
def get_cards_in_order(cursor):
    cursor.execute("SELECT * FROM card ORDER BY card.order ASC")
    return cursor.fetchall()


def get_boards(force=False):
    return _get_data('boards',"board", force)


def get_cards(force=False):
    return _get_data('cards', "card", force)

@connection.connection_handler
def update_card_order(cursor,card_id, card_order):
    cursor.execute("""UPDATE card SET "order" = %(order)s WHERE id = %(id)s""",{"order":card_order,"id":card_id})