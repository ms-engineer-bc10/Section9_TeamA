import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.models import db
from flask_cors import CORS

from app.routes.user_routes import user_routes
from app.routes.condition_routes import condition_routes
from app.routes.recommendation_routes import recommend_routes
from app.routes.store_routes import store_routes
from app.routes.api_request_routes import api_request_routes
from app.routes.business_routes import business_routes
from app.routes.like_routes import like_routes

import firebase_admin
from firebase_admin import credentials
from app.auth.auth_routes import auth_routes

migrate = Migrate()

# アプリケーションファクトリ関数を定義
def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # データベース設定
    database_url = os.getenv('DATABASE_URL', 'sqlite:///default.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # データベースとマイグレーションの初期化
    db.init_app(app)
    migrate.init_app(app, db)

    # Firebase Admin SDKの初期化
    cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
    firebase_admin.initialize_app(cred, {
        'projectId': os.environ['FIREBASE_PROJECT_ID'],
    })

    
    # ルートを登録(ブループリントの登録)
    app.register_blueprint(auth_routes, url_prefix='/api/auth')
    app.register_blueprint(user_routes, url_prefix='/api/user')
    app.register_blueprint(condition_routes, url_prefix='/api/conditions')
    app.register_blueprint(recommend_routes, url_prefix='/api/recommendations')
    app.register_blueprint(store_routes, url_prefix='/api/stores')
    app.register_blueprint(api_request_routes, url_prefix='/api/api_requests')
    app.register_blueprint(business_routes, url_prefix='/api/businesses')
    app.register_blueprint(like_routes, url_prefix='/api/likes')
    
    @app.route('/')
    def hello_world():
        return 'Hello, World!'

    return app

# アプリケーションインスタンスを作成
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
