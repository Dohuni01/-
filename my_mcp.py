# import asyncio
# from agents.mcp.server import *

# async def get_contacts():
#     async with MCPServerStdio(
#         params={
#             "command": "npx",
#             "args": ["-y", "@modelcontextprotocol/server-filesystem", "info_dir"],
#         }
#     ) as server:
#         # 파일 읽기
#         result = await server.call_tool("read_file", {"path": "info_dir/contacts.txt"})
#         if getattr(result, 'isError', False):
#             print("파일 읽기 실패:", result.content[0].text)
#             return

#         file_content = result.content[0].text
#         contacts = []
#         name_set = set()  # 이름 빠른 검색용
#         for line in file_content.strip().splitlines():
#             if line.strip():
#                 name, number = line.strip().split(":", 1)
#                 contacts.append((name, number))
#                 name_set.add(name)
#         print("Contacts:", contacts)

#         # 1. 홍길동 있는지 확인
#         if "김철수" in name_set:
#             print("있음")
#         else:
#             print("없음")

#         # 2. 장대한 추가 (이미 있으면 안 추가)
#         if "장대한" not in name_set:
#             contacts.append(("장대한", "010-1111-1111"))
#             print("장대한 추가됨.")
#             # 파일에 다시 저장 (write_file)
#             new_content = '\n'.join(f"{n}:{num}" for n, num in contacts) + '\n'
#             write_result = await server.call_tool("write_file", {
#                 "path": "info_dir/contacts.txt",
#                 "content": new_content
#             })
#             if getattr(write_result, 'isError', False):
#                 print("파일 저장 실패:", write_result.content[0].text)
#             else:
#                 print("전화번호부에 저장 완료!")
#         else:
#             print("장대한 이미 존재!")

# if __name__ == "__main__":
#     asyncio.run(get_contacts())



import asyncio

from agents import *
from agents.mcp.server import *

async def main():
    try: 
        async with MCPServerStdio(
            params={
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-filesystem", "info_dir"],
            }
        ) as server1:
            my_first_agent = Agent(
                name="Guardrail check",
                instructions="모든 .txt 파일을 무조건 읽고 제 질문 대한 대답을 해주세요",
                mcp_servers=[server1]
            )
            result = await Runner.run(my_first_agent, "홍길동 전화번호 알려줘")
            print(result.final_output)
    except Exception as e:
        print(f"Error: {e}")
if __name__ == "__main__":
    asyncio.run(main())
    