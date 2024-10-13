# app/auth/auth_service.py

from app import db
from app.models import User  # モデルを適切に import してください

def create_or_update_user(uid, email):
    user = User.query.filter_by(firebase_uid=uid).first()
    if user:
        user.email = email
    else:
        user = User(firebase_uid=uid, email=email)
        db.session.add(user)
    db.session.commit()
    return user