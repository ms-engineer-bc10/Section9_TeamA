# import os
# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

# # アプリケーションファクトリ関数を定義
# def create_app():
#     app = Flask(__name__)

# # データベース設定
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password@db/souvenir_app'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# # インスタンス作成をアプリケーションファクトリ内に移動
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)


# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

#   return app

# # アプリケーションインスタンスを作成
# app = create_app()

# # モデルのインポート
# from app.models import models

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

# アプリケーションファクトリ関数を定義
def create_app():
    app = Flask(__name__)
    
    # データベース設定
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password@db/souvenir_app'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # データベースとマイグレーションの初期化
    db.init_app(app)
    migrate.init_app(app, db)
    
    # ルートの設定
    @app.route('/')
    def hello_world():
        return 'Hello, World!'
    
    return app

# アプリケーションインスタンスを作成
app = create_app()

# モデルのインポート（循環インポートを避けるため、ここで行う）
from app.models import models

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)