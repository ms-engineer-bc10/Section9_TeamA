import os
from flask import Flask
from app.routes.user_routes import user_routes
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.models import db

migrate = Migrate()


# アプリケーションファクトリ関数を定義
def create_app():
    app = Flask(__name__)
    
    # データベース設定
    app.config['SQLALCHEMY_DATABASE_URI'] = 'DATABASE_URL'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # データベースとマイグレーションの初期化
    # SQLAlchemyとアプリを連携する
    db.init_app(app)
    # Migrateとアプリを連携する
    migrate.init_app(app, db)
    
    app.register_blueprint(user_routes, url_prefix='/api/user')
    
    return app

# アプリケーションインスタンスを作成
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)