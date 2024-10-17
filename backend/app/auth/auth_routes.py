from flask import Blueprint, request, jsonify
from app.auth.auth_service import register_user

# Blueprintの定義
auth_routes = Blueprint('auth_routes', __name__)

# /registerエンドポイントの定義
@auth_routes.route('/register', methods=['POST'])
def register():
    # リクエストからJSONデータを取得
    data = request.get_json()

    # デバッグのために受け取ったデータを出力
    print(f"Received data: {data}")

    # 受け取ったデータから必要なフィールドを抽出
    id_token = data.get('idToken')
    uid = data.get('uid')
    email = data.get('email')

    # 必要なデータが不足している場合のエラーハンドリング
    if not id_token or not uid or not email:
        return jsonify({'message': '必要なデータが不足しています。'}), 400

    try:
        # データベース保存のコードはCORS確認のため一旦コメントアウト
        # user = register_user(id_token, uid, email)

        # テスト用にCORSの確認をするため、仮のレスポンス
        return jsonify({'message': 'CORS問題が解決しました。'}), 201
    except Exception as e:
        # エラー発生時のエラーメッセージを出力
        print(f"Error during registration: {str(e)}")
        return jsonify({'message': str(e)}), 400
