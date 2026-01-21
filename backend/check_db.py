import sqlite3
conn = sqlite3.connect('database.db')
cursor = conn.cursor()
try:
    # Note que troquei is_admin por user_type
    cursor.execute("SELECT id, username, email, user_type FROM users")
    for u in cursor.fetchall():
        print(f"ID: {u[0]} | Nome: {u[1]} | Email: {u[2]} | Tipo: {u[3]}")
except Exception as e:
    print(f"Erro: {e}")
finally:
    conn.close()