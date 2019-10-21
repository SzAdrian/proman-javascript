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
    cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table)))
    return cursor.fetchall()

@connection.connection_handler
def last_id(cursor,table):
    cursor.execute(sql.SQL("SELECT MAX(id) FROM {}").format(sql.Identifier(table)))
    return cursor.fetchone()

@connection.connection_handler
def save_board(cursor,data):
    qdata = data['title']
    cursor.execute(sql.SQL("INSERT INTO {} ({}) VALUES ({});").format(sql.Identifier("board"),sql.Identifier('title'),sql.Literal(qdata)))

@connection.connection_handler
def save_card(cursor,data):
    cursor.execute(f"""INSERT INTO card (board_id,title,status_id) VALUES ({data["board_id"]},'{data["title"]}',{data["status_id"]})""")

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
    cursor.execute("UPDATE card SET status_id= %(newcolumn)s WHERE id = %(cardid)s",{"newcolumn":data["new_column_id"],"cardid":data["card_id"]})

def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)

@connection.connection_handler
def edit_card(cursor,data):
    cursor.execute("UPDATE card SET title = %(cardtitle)s WHERE id = %(cardid)s",{"cardtitle":data["card_title"],"cardid":data["card_id"]})

def get_statuses(force=False):
    return _get_data('statuses', "status", force)


def get_boards(force=False):
    return _get_data('boards',"board", force)


def get_cards(force=False):
    return _get_data('cards', "card", force)
