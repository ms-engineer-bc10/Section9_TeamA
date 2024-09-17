import os
from dotenv import load_dotenv

# .env ファイルから環境変数を読み込む
load_dotenv()

class Config:
    # アプリケーションのシークレットキー
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # データベース設定
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Stripe設定
    STRIPE_PUBLIC_KEY = os.environ.get('STRIPE_PUBLIC_KEY')
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')

    # Google Maps API設定
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

    # Firebase設定（必要に応じて）
    FIREBASE_CONFIG = {
        "apiKey": os.environ.get('FIREBASE_API_KEY'),
        "authDomain": os.environ.get('FIREBASE_AUTH_DOMAIN'),
        "projectId": os.environ.get('FIREBASE_PROJECT_ID'),
        "storageBucket": os.environ.get('FIREBASE_STORAGE_BUCKET'),
        "messagingSenderId": os.environ.get('FIREBASE_MESSAGING_SENDER_ID'),
        "appId": os.environ.get('FIREBASE_APP_ID')
    }

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

# 環境に応じて適切な設定を選択
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}