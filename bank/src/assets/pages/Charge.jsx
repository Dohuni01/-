// src/pages/Benefit.jsx
import React, { useState } from "react";
import SwipePage from "../components/SwipePage";
import Mic from "../components/Mic";

// 계좌 리스트 예시
const ACCOUNTS = [
  {
    bank: "국민은행",
    num: "9934",
    type: "나라사랑",
    balance: 1643056,
    icon: "🌝", // 실제 이미지는 src/assets에 넣고 <img>로 교체 가능
  },
  {
    bank: "토스뱅크",
    num: "1234",
    type: "입출금",
    balance: 870000,
    icon: "💳",
  },
  {
    bank: "신한은행",
    num: "6789",
    type: "주거래",
    balance: 532000,
    icon: "🔷",
  },
];

// 금액 버튼 목록
const BUTTONS = [
  { label: "100만원", value: 1000000 },
  { label: "50만원", value: 500000 },
  { label: "30만원", value: 300000 },
  { label: "20만원", value: 200000 },
  { label: "10만원", value: 100000 },
  { label: "직접 입력하기", value: "custom" }
];

export default function Benefit() {
  const [selectedAccount, setSelectedAccount] = useState(0);

  const account = ACCOUNTS[selectedAccount];

  // 좌우 계좌 전환
  const handlePrev = () => setSelectedAccount(i => (i - 1 + ACCOUNTS.length) % ACCOUNTS.length);
  const handleNext = () => setSelectedAccount(i => (i + 1) % ACCOUNTS.length);

  // 최대 충전 가능 금액(임의)
  const maxAmount = 1839120;

  return (
    <SwipePage>
      <div className="flex flex-col items-center min-h-screen bg-[#23232A] px-4 pt-10 relative">
        {/* 상단 계좌 박스 */}
        <div className="w-full max-w-md flex items-center justify-between mb-8">
          <button
            className="w-10 h-10 rounded-full bg-[#363740] flex items-center justify-center text-white text-2xl"
            onClick={handlePrev}
            aria-label="이전 계좌"
          >
            &#60;
          </button>
          <div className="flex-1 mx-4 bg-[#363740] rounded-2xl flex items-center px-4 py-4 shadow">
            {/* 아이콘/이미지 */}
            <div className="w-12 h-12 rounded-full bg-[#857661] flex items-center justify-center text-2xl mr-4">
              {account.icon}
            </div>
            <div className="flex flex-col justify-center flex-1">
              <div className="text-lg text-white font-semibold">
                {account.bank} {account.num} 에서
              </div>
              <div className="text-gray-300 text-sm">{account.type} | {account.balance.toLocaleString()}원</div>
            </div>
            <div className="text-gray-400 ml-2 text-lg">{/* &gt; */}▶</div>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-[#363740] flex items-center justify-center text-white text-2xl"
            onClick={handleNext}
            aria-label="다음 계좌"
          >
            &#62;
          </button>
        </div>

        {/* 최대 가능 금액 */}
        

        {/* 3x2 그리드 버튼 */}
        <div className="w-full max-w-md grid grid-cols-3 grid-rows-2 gap-4 mt-3 mb-12">
          {BUTTONS.slice(0, 5).map((btn, idx) => (
            <button
              key={btn.label}
              className={`
                flex flex-col items-center justify-center h-20 rounded-2xl bg-[#2e2f35] 
                text-white font-bold text-xl shadow hover:bg-[#363740] transition
              `}
              // onClick={...} // TODO: 클릭 이벤트 추가 가능
            >
              {btn.label}
              {idx === 0 && (
                <span className="block mt-1 text-xs text-gray-400 font-normal">
                  {/* 100만원 오른쪽 설명 */}
                </span>
              )}
            </button>
          ))}
          <button
            key={BUTTONS[5].label}
            className={`
              flex flex-col items-center justify-center h-20 rounded-2xl bg-[#2e2f35] 
              text-white font-bold text-base shadow hover:bg-[#363740] transition
            `}
            // onClick={...} // TODO: 클릭 이벤트 추가 가능
          >
            {BUTTONS[5].label}
          </button>
        </div>
        <Mic />
      </div>
    </SwipePage>
  );
}
