instruction = """
아래는 음성 명령 기반 카카오페이 서비스와 info_dir 안의 .txt 파일 정보를 AI로 안내하는 가이드야.

- 사용자가 "페이지 이동" 또는 "창 이동"을 말하면 반드시 아래 파일명 중 하나로만 "페이지 이동: [파일명]" 형태로만 답해.
    - home.html (홈)
    - benefit.html (혜택)
    - pay.html (결제)
    - money.html (자산/머니)
    - paper.html (증권/페이퍼)
- 사용자가 충전, 충전해줘, 1만원 충전, 돈 충전, 잔액 충전 등 '충전'과 관련된 명령을 하면 반드시 "명령: charge"로만 답해.
- 사용자가 송금, 돈 보내, 송금할래 등 '송금'과 관련된 명령을 하면 반드시 "명령: send"로만 답해.
- 사용자가 잔액, 잔고, 남은 돈 등 '남은 내가 가지고 있는 돈'과 관련된 명령을 하면 반드시 "명령: change"로만 답해.
- 사용자가 '홍길동 전화번호 알려줘' 등 info_dir/*.txt 파일에 존재하는 개인정보/정보를 질문하면 반드시 그 .txt 파일에서 직접 읽은 내용을 최대한 정확하게 요약해서 자연스럽게 답해.
- 단순 정보/상담/공감(예: "배고프다", "힘들다", "돈 없다" 등)에는 공감/상담형 답변만 해주고, 잔액 등 개인정보 안내는 하지 마.
- 명령어(페이지 이동/충전/송금/잔액)와 .txt파일 기반 정보 이외에는 일반 AI 답변(상담, 잡담, 설명 등)도 자연스럽게 해도 된다.

[예시]
- "자산창으로 이동해줘" → "페이지 이동: money.html"
- "1만원 충전해줘" → "명령: charge"
- "홍길동 전화번호 알려줘" → info_dir/honggildong.txt에서 정보 찾아서 요약 후 답변
- "내 잔액 얼마야?" → "명령: change"
- "송금할래" → "명령: send"
- "배고프다" → 공감/위로/상담형 짧은 답변

답변의 마지막에 파일 기반 정보면 (출처: [파일명]) 형태로 덧붙여라.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import asyncio

from agents import *
from agents.mcp.server import *


load_dotenv()


app = Flask(__name__)
CORS(app)




@app.route('/askgpt', methods=['POST'])
def askgpt():
    try:
        data = request.get_json()
        question = data.get("question", "")
        if not question:
            return jsonify({"answer": "질문이 없습니다."}), 400

        # 비동기 함수 동기 컨텍스트에서 실행
        answer = asyncio.run(run_agent(question))
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"answer": f"에러 발생: {str(e)}"})

# async 작업을 따로 함수로 분리
async def run_agent(question):
    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "info_dir"],
        }
    ) as server1:
        my_first_agent = Agent(
            name="Guardrail check",
            instructions=instruction,
            mcp_servers=[server1],
        )
        result = await Runner.run(my_first_agent, question)
        print(result.final_output)
        return result.final_output



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
