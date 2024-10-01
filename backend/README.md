# API エンドポイント設計書  
## 1. ユーザー認証関連エンドポイント
### GET /users
* 説明：すべてのユーザー情報を取得する。ユーザーの統計データを分析する際に使用できる。
* レスポンス：
    ```
    [
        {
            "id": 1,
            "name": "山田太郎",
            "email": "taro.yamada@example.com",
            "age": 25,
            "gender": "male",
            "registration_day": "2024-01-01",
            "latest_login_day": "2024-09-20",
            "recommend_count": 3,
            "firebase_auth": true
        }
    ]
    ```

### POST /users
* 説明：新しいユーザーを作成する（Google認証時）新規ユーザーがアカウントを作成した際にその情報をDBに保存する。
* リクエスト：
    ```
    {
        "name": "山田太郎",
        "email": "taro.yamada@example.com",
        "age": 25,
        "gender": "male",
        "firebase_auth": true
    }
    ```
* レスポンス：
    ```
    {
        "message": "ユーザーが作成されました",
        "user_id": 1
    }
    ```

## 2. 条件設定エンドポイント
### POST /conditions
* 説明：ユーザーのおみやげ条件を作成する
* リクエスト：
    ```
    {
        "user_id": 1,
        "target": "家族",
        "genre": "たべもの",
        "budget": 5000,
        "quantity": 3
    }
    ```
* レスポンス：
    ```
    {
        "message": "条件が保存されました",
        "condition_id": 1
    }
    ```

### GET /conditions/{user_id}
* 説明：特定ユーザーの過去の条件を取得する
* レスポンス：
    ```
    [
        {
            "condition_id": 1,
            "target": "家族",
            "genre": "たべもの",
            "budget": 5000,
            "quantity": 3,
            "search_date": "2024-09-23"
        }
    ]
    ```

## 3. おすすめおみやげエンドポイント
### POST /recommend
* 説明：おみやげの条件に基づいて、AIによるおすすめを取得する
* リクエスト：
    ```
    {
        "condition_id": 1
    }
    ```
* レスポンス：
    ```
    {
        "product_name": "東京バナナ",
        "product_url": "https://example.com/tokyo-banana",
        "product_price": 1500,
        "ai_recommendation": "手軽に贈れる人気おみやげです。",
        "store_info": {
            "name": "おみやげショップ",
            "address": "東京都渋谷区1-1-1",
            "phone_number": "03-1234-5678",
            "business_hour": "10:00 - 20:00",
            "location": "https://maps.google.com/?q=35.6895,139.6917"
        }
    }
    ```

## 4. 統計データエンドポイント
### GET /statistics
* 説明：企業ユーザーがアクセスするための、年令や性別ごとの統計データを取得する
* レスポンス：
    ```
    [
        {
            "user_id": 1,
            "age_range": "20-29",
            "gender": "male",
            "search_count": 10,
            "count_by_genre": {
            "たべもの": 7,
            "もの": 3
            },
            "count_by_budget": {
            "0-1999": 2,
            "2000-3999": 5,
            "4000-5999": 3
            },
            "count_by_quantity": {
            "1個": 6,
            "2-5個": 4
            }
        }
    ]
    ```

## 5. クライアント情報エンドポイント（企業向け）
### GET /clients
* 説明：企業ユーザーの情報を取得する
* レスポンス：
    ```
    [
        {
            "client_id": 1,
            "name": "株式会社サンプル",
            "email": "client@example.com",
            "phone_number": "03-1234-5678",
            "company_name": "サンプル商事",
            "latest_login_day": "2024-09-23",
            "payment_id": 1001
        }
    ]
    ```

## 6. APIリクエスト履歴エンドポイント
### GET /api-requests
* 説明：APIリクエストの履歴を取得する
* レスポンス：
    ```
    [
        {
            "request_id": 1,
            "user_id": 1,
            "request_date": "2024-09-23T12:34:56Z",
            "api_name": "/recommend",
            "result": "成功",
            "error_message": null
        }
    ]
    ```

## 7. 支払い履歴エンドポイント（企業向け）
### GET /payments/{client_id}
* 説明：特定の企業ユーザーの支払い履歴を取得する
* レスポンス：
    ```
    [
        {
            "payment_id": 1001,
            "payment_amount": 12000,
            "payment_method": "クレジットカード",
            "payment_date": "2024-09-23T12:00:00Z"
        }
    ]
    ```
