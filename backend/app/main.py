import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.models import db
from flask_cors import CORS
from dotenv import load_dotenv
# import stripe

from app.routes.user_routes import user_routes
from app.routes.condition_routes import condition_routes
from app.routes.recommend_routes import recommend_routes
from app.routes.store_routes import store_routes
from app.routes.api_request_routes import api_request_routes

migrate = Migrate()

# 環境変数を読み込む
load_dotenv()

# アプリケーションファクトリ関数を定義
def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": "*"}})
    
    # データベース設定
    database_url = os.getenv('DATABASE_URL', 'sqlite:///default.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Stripe設定
    # stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

    # データベースとマイグレーションの初期化
    db.init_app(app)
    migrate.init_app(app, db)
    
    # # ルートを登録(ブループリントの登録)
    app.register_blueprint(user_routes, url_prefix='/api/user')
    app.register_blueprint(condition_routes, url_prefix='/api/conditions')
    app.register_blueprint(recommend_routes, url_prefix='/api/recommends')
    app.register_blueprint(store_routes, url_prefix='/api/stores')
    app.register_blueprint(api_request_routes, url_prefix='/api/api_requests')
    
    

    @app.route('/')
    def hello_world():
        return 'Hello, World!'
    

    return app

# アプリケーションインスタンスを作成
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
