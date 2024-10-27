from flask import Blueprint, request, jsonify
import openai
import os

chart_analysis = Blueprint('chart_analysis', __name__)

@chart_analysis.route('/analyze-chart', methods=['POST'])
def analyze_chart():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        # OpenAI APIキーを環境変数から取得
        openai.api_key = os.getenv('OPENAI_API_KEY')
        
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "あなたはおみやげアプリのデータアナリストです。データを分析し、実用的な示唆を提供してください。"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2000,  # トークン数を増やす（約1000文字相当）
            temperature=0.7
        )
        
        analysis = completion.choices[0].message['content']
        
        return jsonify({
            'analysis': analysis,
            'status': 'success'
        }), 200
        
    except Exception as e:
        print(f"Error in analyze_chart: {str(e)}")  # デバッグ用ログ
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500