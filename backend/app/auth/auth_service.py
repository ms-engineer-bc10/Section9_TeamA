from app import db
from app.models import User
from datetime import datetime

def create_or_update_user(uid, email):
    try:
        user = User.query.get(uid)
        if user:
            user.email = email
            user.latest_login_at = datetime.now()
        else:
            user = User(uid=uid, email=email)
            db.session.add(user)
        db.session.commit()
        return user
    except Exception as e:
        db.session.rollback()
        raise Exception(f"Failed to create or update user: {str(e)}")