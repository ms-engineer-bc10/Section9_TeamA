from flask import Blueprint, request, jsonify
from app.auth.auth_service import register_user

# Blueprintの定義
auth_routes = Blueprint('auth_routes', __name__)

import traceback  # トレースバック情報を取得するためにインポート

@auth_routes.route('/register', methods=['POST'])
def register():
    # リクエストからJSONデータを取得
    data = request.get_json()

    # デバッグのために受け取ったデータを出力
    print(f"Received data: {data}", flush=True)

    # 受け取ったデータから必要なフィールドを抽出
    id_token = data.get('idToken')
    uid = data.get('uid')
    email = data.get('email')

    # 必要なデータが不足している場合のエラーハンドリング
    if not id_token or not uid or not email:
        return jsonify({'message': '必要なデータが不足しています。'}), 400

    try:
        # データベースにユーザーを登録
        user = register_user(id_token, uid, email)

        # 正常に登録された場合のレスポンス
        return jsonify({'message': 'ユーザー登録に成功しました。', 'user': user}), 201
    except Exception as e:
        # エラー発生時のエラーメッセージを出力
        print(f"Error during registration: {str(e)}", flush=True)
        return jsonify({'message': str(e)}), 400
