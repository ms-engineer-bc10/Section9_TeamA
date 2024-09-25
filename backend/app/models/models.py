from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ApiRequest(db.Model):
    __tablename__ = 'api_request'

    request_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id'))
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    api_name = db.Column(db.String(255))
    result = db.Column(db.String(255))
    error_message = db.Column(db.String(255))

class UserInfo(db.Model):
    __tablename__ = 'user_info'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    age = db.Column(db.Integer)
    gender = db.Column(db.Enum('male', 'female', 'other'))
    registration_day = db.Column(db.DateTime, default=datetime.utcnow)
    latest_login_day = db.Column(db.DateTime)
    request_count = db.Column(db.Integer, default=0)
    recomend_count = db.Column(db.Integer, default=0)
    firebase_auth = db.Column(db.Boolean, default=False)
    firebase_auth = db.Column(db.Boolean, default=False)
    stripe_auth = db.Column(db.Boolean, default=False)

class OmiyageConditions(db.Model):
    __tablename__ = 'omiyage_conditions'
    
    condition_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id'))
    target = db.Column(db.Enum('self', 'gift'))
    genre = db.Column(db.Enum('food', 'crafts', 'other'))
    budget = db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    search_date = db.Column(db.DateTime, default=datetime.utcnow)

class RecommendRecords(db.Model):
    __tablename__ = 'recommend_records'
    
    recommend_record_id = db.Column(db.Integer, primary_key=True)
    condition_id = db.Column(db.Integer, db.ForeignKey('omiyage_conditions.condition_id'))
    product_name = db.Column(db.String(255))
    product_url = db.Column(db.String(255))
    product_price = db.Column(db.Integer)
    product_category = db.Column(db.Enum('food', 'crafts', 'other'))
    store_name = db.Column(db.String(255))
    store_id = db.Column(db.Integer, db.ForeignKey('store_info.store_id'))
    recommend_date = db.Column(db.DateTime, default=datetime.utcnow)

class StoreInfo(db.Model):
    __tablename__ = 'store_info'
    
    store_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    business_hour = db.Column(db.String(255))
    location = db.Column(db.String(255))

class PaymentHistory(db.Model):
    __tablename__ = 'payment_history'
    
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id'))
    payment_amount = db.Column(db.Integer)
    payment_method = db.Column(db.String(50))
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    the_number_of_suggestion = db.Column(db.Integer)

class StatisticalData(db.Model):
    __tablename__ = 'statistical_data'
    
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id'), primary_key=True)
    age_range = db.Column(db.Integer)
    gender = db.Column(db.Enum('male', 'female', 'other'))
    search_count = db.Column(db.Integer, default=0)
    count_by_genre = db.Column(db.String(255))
    count_by_budget = db.Column(db.Integer, default=0)
    count_by_quantity = db.Column(db.Integer, default=0)