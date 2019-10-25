import psycopg2
import psycopg2.extras

def get_connection_string():
    return 'postgresql://pkvqouchzlgwhy:ee3ac1dd43aedeb35e3a24fc74cf6f00348c5363d42cbd4170533fb16865d71c@ec2-54-217-225-16.eu-west-1.compute.amazonaws.com/d192i0bvallsbq'


def open_database():
    try:
        connection_string = get_connection_string()
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print('Database connection problem')
        raise exception
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value

    return wrapper
