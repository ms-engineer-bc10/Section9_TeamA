# # C:\bc10\section9_teamA\backend\app\routes\chart_analysis.py

# from flask import Blueprint, request, jsonify
# import openai
# import os

# chart_analysis = Blueprint('chart_analysis', __name__)

# @chart_analysis.route('/analyze-chart', methods=['POST'])
# def analyze_chart():
#     try:
#         print("Received analyze-chart request")  # デバッグログ追加
#         data = request.get_json()
#         if not data or 'prompt' not in data:
#             return jsonify({
#                 'error': 'No prompt provided',
#                 'status': 'error'
#             }), 400

#         prompt = data['prompt']
#         print(f"Received prompt: {prompt}")  # デバッグログ追加
        
#         openai.api_key = os.getenv('OPENAI_API_KEY')
#         if not openai.api_key:
#             print("OpenAI API key not found")  # デバッグログ追加
#             return jsonify({
#                 'error': 'OpenAI API key not configured',
#                 'status': 'error'
#             }), 500
        
#         completion = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "あなたはおみやげアプリのデータアナリストです。データを簡潔に分析し、実用的な示唆を提供してください。"
#                 },
#                 {
#                     "role": "user",
#                     "content": prompt
#                 }
#             ],
#             max_tokens=150,
#             temperature=0.7
#         )
        
#         analysis = completion.choices[0].message['content']
#         print(f"Generated analysis: {analysis}")  # デバッグログ追加
        
#         return jsonify({
#             'analysis': analysis,
#             'status': 'success'
#         }), 200
        
#     except Exception as e:
#         print(f"Error in analyze_chart: {str(e)}")  # デバッグログ追加
#         return jsonify({
#             'error': str(e),
#             'status': 'error'
#         }), 500

# C:\bc10\section9_teamA\backend\app\routes\chart_analysis.py

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