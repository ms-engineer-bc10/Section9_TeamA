from app.models import User, db  # Userモデルとデータベースセッションをインポート
from app.auth.auth_utils import verify_token

# ユーザーを登録するための関数
def register_user(id_token, uid, email):
    # IDトークンを検証してデコードされたトークン情報を取得
    decoded_token = verify_token(id_token)

    # 検証されたUIDと送信されたUIDが一致しているか確認
    if decoded_token['uid'] != uid:
        raise Exception("UIDが一致しません")

    # ユーザーが存在するか確認
    existing_user = User.query.filter_by(uid=uid).first()

    # ユーザーが存在しない場合、新しいユーザーを作成して保存
    if not existing_user:
        new_user = User(uid=uid, email=email)
        db.session.add(new_user)
        db.session.commit()

        # 新しいユーザーの情報を辞書形式で返す
        return {
            'uid': new_user.uid,
            'email': new_user.email,
            'name': new_user.name,  # 必要に応じて他の属性も追加
        }
    else:
        raise Exception("ユーザーは既に存在します。")
