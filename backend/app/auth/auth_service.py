from app.models import db, User
from datetime import datetime

def create_or_update_user(uid, email):
    user = User.query.get(uid)
    if user:
        user.email = email
        user.latest_login_at = datetime.now()
    else:
        user = User(uid=uid, email=email, registered_at=datetime.now(), latest_login_at=datetime.now())
        db.session.add(user)

    db.session.commit()
    return user
