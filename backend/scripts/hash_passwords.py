import sqlite3
import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def update_passwords():
    db = sqlite3.connect('C:/Users/user/Documents/אסי/תכנות/1/backend/data.db')
    cursor = db.cursor()
    cursor.execute("SELECT id, password FROM users")
    users = cursor.fetchall()
    
    for user in users:
        user_id, plain_password = user
        hashed_password = hash_password(plain_password)
        cursor.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            (hashed_password, user_id)
        )
    
    db.commit()
    db.close()

if __name__ == "__main__":
    update_passwords()
