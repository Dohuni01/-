// src/pages/Pay.jsx
import React, { useState } from "react";
import SwipePage from "../components/SwipePage";
import Mic from "../components/Mic";
// 예시 바코드/QR은 임의경로, 실제 public/에 png 파일 추가 필요
const ACCOUNTS = [
  {
    bank: "카카오페이증권",
    barcode: "/barcode1.png", // 바코드 이미지 경로
    qr: "/qr1.png",           // QR코드 이미지 경로
    card: {
      color: "bg-yellow-400",
      label: (
        <div className="flex flex-col items-start">
          <div className="font-bold text-black text-xl flex items-center">
            <span className="mr-2">💬pay</span> 머니
          </div>
          <span className="text-xs text-black mt-1">카카오페이증권</span>
        </div>
      ),
      chip: true,
      op: true,
    },
    cards: [
      { img: "/card1.png", label: "카카오페이", active: true },
      { img: "/card2.png", label: "하나카드" },
      { img: "/card3.png", label: "네이버" },
      { img: "/card4.png", label: "VISA" },
    ],
  },
  {
    bank: "국민은행",
    barcode: "/barcode2.png",
    qr: "/qr2.png",
    card: {
      color: "bg-yellow-200",
      label: (
        <div className="font-bold text-yellow-900 text-xl">국민은행</div>
      ),
      chip: false,
      op: false,
    },
    cards: [
      { img: "/card2.png", label: "하나카드", active: true },
      { img: "/card1.png", label: "카카오페이" },
      { img: "/card3.png", label: "네이버" },
      { img: "/card4.png", label: "VISA" },
    ],
  },
  {
    bank: "토스뱅크",
    barcode: "/barcode3.png",
    qr: "/qr3.png",
    card: {
      color: "bg-blue-400",
      label: (
        <div className="font-bold text-white text-xl">토스뱅크</div>
      ),
      chip: false,
      op: false,
    },
    cards: [
      { img: "/card3.png", label: "네이버", active: true },
      { img: "/card1.png", label: "카카오페이" },
      { img: "/card2.png", label: "하나카드" },
      { img: "/card4.png", label: "VISA" },
    ],
  },
];

export default function Pay() {
  const [idx, setIdx] = useState(0);
  // 상/하 스와이프
  const { ref } = require("react-swipeable")({
    onSwipedUp: () => setIdx(i => (i < ACCOUNTS.length - 1 ? i + 1 : i)),
    onSwipedDown: () => setIdx(i => (i > 0 ? i - 1 : i)),
    delta: 30,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });

  const acc = ACCOUNTS[idx];

  return (
    <SwipePage>
      <div ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] px-0 pt-6 pb-8 relative select-none">
        {/* 바코드 */}
        <div className="w-[90vw] max-w-xl bg-white rounded-xl mt-2 mb-5 flex justify-center items-center">
          <img src={acc.barcode} alt="바코드" className="w-[90%] h-14 object-contain" />
        </div>

        {/* QR 코드 */}
        <div className="w-[90vw] max-w-xs bg-white rounded-xl flex justify-center items-center mb-5">
          <img src={acc.qr} alt="QR코드" className="w-40 h-40 object-contain p-4" />
        </div>

        {/* 메인 카드 */}
        <div className={`w-[90vw] max-w-xs h-28 rounded-xl ${acc.card.color} shadow-lg flex items-center px-6 mb-6 relative`}>
          {acc.card.label}
          {/* 옵션 표시 예시 */}
          {acc.card.chip && (
            <span className="absolute right-5 top-6 bg-white text-xs px-2 py-1 rounded-full font-bold text-gray-800 shadow">OP</span>
          )}
        </div>

        {/* 카드 선택(수평 스크롤) */}
        <div className="flex gap-3 w-[90vw] max-w-xl mb-6 overflow-x-auto px-2 py-2 scrollbar-hide">
          {acc.cards.map((c, i) => (
            <div key={c.label}
              className={`flex flex-col items-center justify-center w-16 h-24 rounded-lg bg-white shadow-md border-2 ${c.active ? "border-yellow-400 scale-105" : "border-transparent"} transition-transform duration-150`}>
              <img src={c.img} alt={c.label} className="w-12 h-12 object-contain mb-1" />
              <span className="text-xs font-medium text-gray-600">{c.label}</span>
            </div>
          ))}
        </div>

        {/* QR결제 버튼 */}
        <button className="w-[90vw] max-w-xl h-14 rounded-xl bg-[#ffe812] text-black text-xl font-bold shadow-lg flex items-center justify-center mt-auto">
          <span className="mr-2">📱</span> QR결제
        </button>

        {/* 하단 인덱스 */}
        <div className="text-xs text-gray-400 mt-4 mb-0">{idx + 1} / {ACCOUNTS.length}</div>
      </div>
      <Mic />
    </SwipePage>
  );
}
