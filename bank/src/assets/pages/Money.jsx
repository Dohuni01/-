// src/pages/Money.jsx
import React from "react";
import SwipePage from "../components/SwipePage";
import Mic from "../components/Mic";
// 은행별 로고 파일명을 logo 속성으로 추가
const accounts = [
  { bank: "국민은행", account: "123-45-6789", balance: 150000, logo: "kb.png" },
  { bank: "신한은행", account: "987-65-4321", balance: 850000, logo: "shinhan.png" },
  { bank: "우리은행", account: "555-22-1111", balance: 450000, logo: "woori.png" },
];

function formatMoney(amount) {
  return amount.toLocaleString() + "원";
}

export default function Money() {
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <SwipePage>
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f7f8fa] px-2">
        {/* 자산 총액 */}
        <div className="mb-12 text-center">
          <div className="text-3xl font-extrabold text-gray-700 tracking-wide mb-3">
            자산 총액
          </div>
          <div className="text-6xl font-black text-[#1676ee] drop-shadow-lg">
            {formatMoney(total)}
          </div>
        </div>

        {/* 계좌 목록 */}
        <div className="w-full max-w-md flex flex-col gap-7">
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-8 rounded-3xl shadow-xl border-4 border-[#cbe5ff]"
              style={{
                minHeight: "110px",
                fontSize: "2rem",
                letterSpacing: "1px",
              }}
            >
              <div className="flex items-center">
                <img
                  src={`/banklogo/${acc.logo}`}
                  alt={`${acc.bank} 로고`}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",        // 동그란 원
                    objectFit: "cover",         // 꽉 차게
                    background: "#fff",         // 투명로고 대비 흰 배경
                    border: "2.5px solid #e0e9f7",
                    boxShadow: "0 1px 5px #eaefff",
                    marginRight: 22,
                    display: "block"
                  }}
                />
                <div>
                  <div className="text-[#1676ee] font-bold text-2xl mb-1">{acc.bank}</div>
                  <div className="text-base text-gray-400 mt-2" style={{ fontSize: "1.2rem" }}>
                    {acc.account}
                  </div>
                </div>
              </div>
              <div className="text-[#3a3a3a] font-extrabold text-3xl" style={{ fontSize: "2rem" }}>
                {formatMoney(acc.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Mic />
    </SwipePage>
  );
}
