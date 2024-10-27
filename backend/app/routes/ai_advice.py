from flask import Blueprint, request, Response, stream_with_context, jsonify
import openai
import os
from flask_cors import CORS

ai_advice_bp = Blueprint('ai_advice', __name__)
CORS(ai_advice_bp)  # このBlueprintに対してCORSを有効化

# OpenAI APIキーの設定
openai.api_key = os.getenv('OPENAI_API_KEY')

SYSTEM_PROMPT = """
あなたはビジネスコンサルタントとして、以下の分野について専門的なアドバイスを提供します：
- 商品開発戦略
- 販売戦略の立案
- 市場分析
- 販売方針の見直し

回答は以下の形式で構造化してください：
1. 現状分析
2. 具体的な提案（3つ程度）
3. 期待される効果
4. 実施における注意点

専門的かつ実践的なアドバイスを、簡潔で分かりやすい日本語で提供してください。
"""
# デバッグ用ルートをここに追加
@ai_advice_bp.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "AI Advice Blueprint is working"})

@ai_advice_bp.route('/get-ai-advice', methods=['POST'])
def get_ai_advice():
    try:
        data = request.get_json()
        query = data.get('query')
        context = data.get('context')

        if not query:
            return jsonify({"error": "相談内容を入力してください。"}), 400

        # OpenAI APIを呼び出し
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"""
                    context: {context}
                    query: {query}

                    上記の相談内容について、システムプロンプトの形式に従ってアドバイスを提供してください。
                """}
            ],
            temperature=0.7,
            max_tokens=1000,
            stream=True
        )

        def generate():
            for chunk in response:
                if hasattr(chunk.choices[0], 'delta') and hasattr(chunk.choices[0].delta, 'content'):
                    content = chunk.choices[0].delta.content
                    if content:
                        yield content

        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream'
        )

    except Exception as e:
        print(f"Error: {str(e)}")  # デバッグ用にエラーを出力
        return jsonify({"error": f"AIアドバイスの取得に失敗しました: {str(e)}"}), 500