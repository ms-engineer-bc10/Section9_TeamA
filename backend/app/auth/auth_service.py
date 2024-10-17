from app.auth.auth_utils import verify_token

# ユーザーを登録するための関数
def register_user(id_token, uid, email):
    # IDトークンを検証してデコードされたトークン情報を取得
    decoded_token = verify_token(id_token)

    # 検証されたUIDと送信されたUIDが一致しているか確認
    if decoded_token['uid'] != uid:
        raise Exception("UIDが一致しません")

    # ここでDBへの保存処理を一時的にコメントアウト
    # 例:
    # new_user = User(uid=uid, email=email)
    # db.session.add(new_user)
    # db.session.commit()

    return {'uid': uid, 'email': email}
