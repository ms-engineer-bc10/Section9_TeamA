# API エンドポイント設計書  

## 1. ユーザー情報管理エンドポイント
### 新規ユーザー作成
### POST /api/users
* 説明：ユーザー情報（UID、名前、年齢、性別、メール）を新規作成
* リクエスト：
    ```
    {
        "uid": "user123",
        "name": "山田 太郎",
        "email": "taro.yamada@example.com",
        "age": 30,
        "gender": "男性"
    }
    ```
* レスポンス：
    ```
    {
        "message": "User created successfully"
    }
    ```

### 特定ユーザー情報取得
### GET /api/users/<uid>
* 説明：指定したユーザーの情報を取得
* レスポンス：
    ```
    {
        "uid": "user123",
        "name": "山田 太郎",
        "email": "taro.yamada@example.com",
        "age": 30,
        "gender": "男性",
        "registered_at": "2024-10-01T12:34:56Z",
        "latest_login_at": "2024-11-01T12:34:56Z",
        "condition_count": 5,
        "recommend_count": 3
    }
    ```

## 2. ユーザー条件登録エンドポイント
### POST /api/user/recommend
* 説明：ユーザーが入力した条件（対象、カテゴリ、予算、数量、場所など）を保存し、その条件に基づいて商品を提案し、提案履歴を保存する
* リクエスト：
    ```
    {
        "target": "友人",
        "genre": "食べ物",
        "budget": "¥2,000〜¥3,999",
        "quantity": "1",
        "location": "35.681236,139.767125"
    }
    ```
* レスポンス：
    ```
    {
        "recommendation_id": "12345",
        "selected_product": {
            "id": "67890",
            "name": "抹茶スイーツセット",
            "price": "¥2,500",
            "image_url": "https://example.com/image.jpg",
            "ai_recommend": "友人へのお土産にぴったりの抹茶味のスイーツです！"
        },
        "places": [
            {
                "name": "京都みやげ店",
                "address": "京都府京都市東山区",
                "rating": 4.5,
                "user_ratings_total": 150,
                "place_id": "abcd1234"
            }
        ]
    }
    ```

## 3. 商品検索エンドポイント
### YahooショッピングAPI経由の検索
* URL: (内部サービスとして search_yahoo_shopping を使用)
* 説明：商品を「場所（都道府県）」「予算範囲」をもとに検索
* 使用例：
    ```
    search_yahoo_shopping(location="東京都", budget_from=2000, budget_to=4000)
    ```

## 4. 店舗情報取得エンドポイント
### Google Places API経由の検索
* URL： (内部サービスとして search_google_places を使用)
* 説明：Google Places APIを用いて、指定した場所の周辺店舗を検索し、商品が購入できる店舗情報を取得する
* 使用例：
    ```
    search_google_places(location="35.681236,139.767125", selected_product_name="抹茶スイーツセット")
    ```

## 5. 位置情報取得エンドポイント
### 都道府県取得
* URL： (内部サービスとして get_prefecture_from_latlng を使用)
* 説明：緯度・経度から都道府県名を取得し、検索用のキーワードとして使用
* 使用例：
    ```
    get_prefecture_from_latlng(latlng="35.681236,139.767125")
    ```
* レスポンス：
    ```
    "東京都"
    ```
### 緯度・経度取得
* URL： (内部サービスとして get_latlng_from_prefecture を使用)
* 説明：都道府県名から緯度・経度を取得し、場所の検索条件として使用
* 使用例：
    ```
    get_latlng_from_prefecture(prefecture_name="東京都")
    ```
* レスポンス：
    ```
    "35.681236,139.767125"
    ```

## ６. いいねエンドポイント
### いいね追加
### POST /api/like/
* 説明：ユーザーが特定の提案に対して「いいね」を追加する。
* リクエスト：
    ```
    {
        "user_id": "user123",
        "recommendation_id": "rec456"
    }
    ```
* レスポンス：
    ```
    {
        "message": "Like added successfully"
    }
    ```

### いいね取得
### GET /api/like/<user_id>
* 説明：指定したユーザーが「いいね」した提案と商品情報を取得する。
* パスパラメータ: user_id (string): ユーザーID
* レスポンス：
    ```
    [
        {
            "id": 1,
            "imageUrl": "https://example.com/product.jpg",
            "likedAt": "2024-11-10T15:30:00"
        },
        {
            "id": 2,
            "imageUrl": "https://example.com/product2.jpg",
            "likedAt": "2024-11-10T16:30:00"
        }
    ]
    ```

## 7. ユーザー履歴取得エンドポイント
### GET /api/history/<user_id>
* 説明：全ての提案履歴を取得し、各履歴に関連するユーザー条件と商品情報を返す。
* レスポンス：
    ```
    [
        {
            "id": "rec123",
            "date": "2024-11-10",
            "answers": {
            "location": "東京都",
            "target": "友人",
            "genre": "食べ物",
            "budget": "2000～4000",
            "quantity": "1"
            },
            "product": {
            "name": "抹茶スイーツセット",
            "price": "2500",
            "image": "https://example.com/image.jpg"
            }
        },
        {
            "id": "rec124",
            "date": "2024-11-11",
            "answers": {
            "location": "京都府",
            "target": "家族",
            "genre": "雑貨",
            "budget": "3000～5000",
            "quantity": "2～5"
            },
            "product": {
            "name": "伝統工芸品",
            "price": "4000",
            "image": "https://example.com/image2.jpg"
            }
        }
    ]
    ```