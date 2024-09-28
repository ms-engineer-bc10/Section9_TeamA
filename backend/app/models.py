from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# SQLAlchemyをインスタンス化する
db = SQLAlchemy()

class ApiRequest(db.Model):
    __tablename__ = 'api_request'

    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), db.ForeignKey('user.uid'))
    requested_at = db.Column(db.DateTime, default=datetime.now)
    api_name = db.Column(db.String(255))
    result = db.Column(db.String(255))
    error_message = db.Column(db.String(255))

class User(db.Model):
    __tablename__ = 'user'
    
    uid = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(50))
    registered_at = db.Column(db.DateTime, default=datetime.now)
    latest_login_at = db.Column(db.DateTime)
    condition_count = db.Column(db.Integer, default=0)
    recomend_count = db.Column(db.Integer, default=0)
    stripe_auth = db.Column(db.String(255))
    payment_reg_at = db.Column(db.DateTime)

    api_requests = db.relationship('ApiRequest', backref='user', lazy=True)
    conditions = db.relationship('Condition', backref='user', lazy=True)

class Condition(db.Model):
    __tablename__ = 'condition'
    
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), db.ForeignKey('user.uid'))
    target = db.Column(db.String(255))
    genre = db.Column(db.String(255))
    budget = db.Column(db.Integer)
    quantity = db.Column(db.String(50))
    searched_at = db.Column(db.DateTime, default=datetime.now)

    recommendations = db.relationship('Recommend', backref='condition', lazy=True)

class Recommend(db.Model):
    __tablename__ = 'recommend'
    
    id = db.Column(db.Integer, primary_key=True)
    condition_id = db.Column(db.Integer, db.ForeignKey('condition.id'))
    product_name = db.Column(db.String(255))
    product_url = db.Column(db.String(255))
    product_price = db.Column(db.Integer)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'))
    recommended_at = db.Column(db.DateTime, default=datetime.now)

class Store(db.Model):
    __tablename__ = 'store'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    tel = db.Column(db.String(50))
    open_time = db.Column(db.String(255))
    location = db.Column(db.String(255))
        
    recommendations = db.relationship('Recommend', backref='store', lazy=True)
    