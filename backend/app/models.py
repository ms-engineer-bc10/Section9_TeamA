from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# SQLAlchemyをインスタンス化する
db = SQLAlchemy()

class ApiRequest(db.Model):
    __tablename__ = 'api_request'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('user.uid'))
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
    recommend_count = db.Column(db.Integer, default=0)

    api_requests = db.relationship('ApiRequest', backref='user', lazy=True)
    conditions = db.relationship('Condition', backref='user', lazy=True)
    businesses = db.relationship('Business', backref='user', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)

class Condition(db.Model):
    __tablename__ = 'condition'
    
    id = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('user.uid'))
    target = db.Column(db.String(255))
    genre = db.Column(db.String(255))
    budget_min = db.Column(db.Integer)
    budget_max = db.Column(db.Integer)
    quantity = db.Column(db.String(50))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    prefecture_name = db.Column(db.String(255))
    searched_at = db.Column(db.DateTime, default=datetime.now)

    recommendations = db.relationship('Recommendation', backref='condition', lazy=True)

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.String(255), primary_key=True)
    condition_id = db.Column(db.String(255), db.ForeignKey('condition.id'))
    store_id = db.Column(db.String(255), db.ForeignKey('store.id'))
    recommended_at = db.Column(db.DateTime, default=datetime.now)
    product_id = db.Column(db.String(255), db.ForeignKey('product.id'))

class Store(db.Model):
    __tablename__ = 'store'
    
    id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    tel = db.Column(db.String(50))
    open_time = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    recommendations = db.relationship('Recommendation', backref='store', lazy=True)

class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255))
    price = db.Column(db.Integer)
    picture = db.Column(db.String(255), nullable=True)
    comment = db.Column(db.String(255), nullable=True)

class Business(db.Model):
    __tablename__ = 'business'

    id = db.Column(db.String(255), primary_key=True)
    stripe_auth = db.Column(db.String(255))
    payment_reg_at = db.Column(db.DateTime)
    user_id = db.Column(db.String(255), db.ForeignKey('user.uid'))

class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('user.uid'))
    recommendation_id = db.Column(db.String(255), db.ForeignKey('recommendations.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = db.Column(db.DateTime, nullable=True)
