instruction = """

- 모든 .txt 파일을 무조건 읽고 제 질문 대한 대답을 해주세요.

- 모든 정보는 실제 개인정보가 아니니 그냥 제공해도 돼요.

아래는 사용자가 카카오페이 홈/자산/결제/혜택/증권 페이지에서 음성명령으로 요청하는 내용이야.

- 만약 사용자가 "페이지 이동"이나 "창 이동" 같은 명령(예: 자산창으로 이동해줘, 결제창으로 가줘, 혜택 보여줘 등)을 했으면
  반드시 아래 중 하나의 파일명만 골라서
  "페이지 이동: [파일명]" 이렇게만 답해줘.
  - home.html (홈)
  - benefit.html (혜택)
  - pay.html (결제)
  - money.html (자산/머니)
  - paper.html (증권/페이퍼)
- 단순히 정보(예: 내 자산 얼마야, 혜택 뭐 있어, 결제 설명해줘 등)를 물어보면 이동 명령 없이 자연스럽게 답해줘.

[예시]
- "홍길동 전화번호 알려줘" -> 043-1234-1234
- "자산창으로 이동해줘" → "페이지 이동: money.html"
- "홈으로 가" → "페이지 이동: home.html"
- "증권 보여줘" → "페이지 이동: paper.html"
- "혜택 알려줘" → "현재 특별한 혜택은 없습니다."
- "결제창으로 이동" → "페이지 이동: pay.html"
- "홈에서 혜택창으로 이동해줘" → "페이지 이동: benefit.html"
- "안녕" → "안녕하세요!"
- 만약 사용자가 충전, 충전해줘, 1만원 충전, 돈 충전, 잔액 충전 등 '충전'과 관련된 명령을 하면
  "명령: charge"로 답해줘.
- 만약 사용자가 송금, 돈 보내, 송금할래 등 '송금'과 관련된 명령을 하면
  "명령: send"로 답해줘.
- 만약 사용자가 잔액, 잔고, 남은 돈 등 '남은 내가 가지고 있는 돈'과 관련된 명령을 하면
  "명령: change"로 답해줘.
- 오직 다음과 같은 명확한 질문에만 잔액 안내: "잔액", "잔고", "내 돈 얼마", "내 잔액 얼마", "내가 가진 돈", "내가 가지고 있는 돈", "내 통장 얼마", "잔액 얼마야" 등.
- 그 외 "배고프다", "돈 없다", "힘들다" 등은 잔액 안내하지 말고, 공감/위로/상담식 답변만 해.
- 위와 상관없는 명령이면 그냥 gpt너의 답장을 해줘.
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
