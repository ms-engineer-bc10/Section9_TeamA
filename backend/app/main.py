import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.models import db
from flask_cors import CORS

from app.routes.user_routes import user_routes

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
    
    # ルートを登録(ブループリントの登録)
    app.register_blueprint(user_routes, url_prefix='/api/user')
    
    @app.route('/')
    def hello_world():
        return 'Hello, World!'

    return app

# アプリケーションインスタンスを作成
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
