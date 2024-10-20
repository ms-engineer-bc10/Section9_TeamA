import firebase_admin
from firebase_admin import auth

# FirebaseのIDトークンを検証し、ユーザー情報を取得
def verify_token(id_token):
    try:
        # Firebase IDトークンを検証
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        # 検証エラー時に例外を投げる
        raise Exception(f"IDトークンの検証に失敗しました: {str(e)}")
