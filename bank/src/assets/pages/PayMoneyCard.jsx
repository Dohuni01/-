import React, { useState } from "react";
import Header from "../components/Header.jsx";
import Navigation from "../components/Navigation.jsx";
import Mic from "../components/Mic.jsx";
const amounts = [1000000, 500000, 300000, 200000, 100000];

export default function PayMoneyCard() {
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  // 충전
  const handleCharge = (amount) => {
    setBalance((prev) => prev + amount);
    alert(`${amount.toLocaleString()}원이 충전되었습니다.`);
    setModalOpen(false);
  };
  const handleCustomCharge = () => {
    const input = prompt("충전할 금액을 직접 입력하세요:");
    const amount = parseInt(input);
    if (!isNaN(amount) && amount > 0) {
      setBalance((prev) => prev + amount);
      alert(`${amount}원이 충전되었습니다.`);
      setModalOpen(false);
    } else {
      alert("올바른 금액을 입력해주세요.");
    }
  };

  // 송금
  const handleSend = () => {
    const account = prompt("계좌번호를 입력하세요:");
    if (!account) return alert("계좌번호를 입력해야 합니다.");
    const amount = prompt("송금할 금액을 입력하세요:");
    const intAmount = parseInt(amount);
    if (isNaN(intAmount) || intAmount <= 0) return alert("올바른 금액을 입력해주세요.");
    if (intAmount > balance) return alert("잔액이 부족합니다.");
    setBalance((prev) => prev - intAmount);
    alert(`${account} 계좌로 ${intAmount.toLocaleString()}원을 송금했습니다.`);
    setSendModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-4 mx-4 relative">
      {/* 상단 */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        페이머니 <span className="text-gray-400 cursor-pointer text-xs">ⓘ</span>
      </div>
      <div className="text-3xl font-bold mt-2">
        <span>{balance.toLocaleString()}</span>원
      </div>
      {/* 오른쪽 점 */}
      <div className="absolute top-4 right-4 flex gap-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
      {/* 이자 혜택 버튼 */}
      <div className="mt-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-full text-sm shadow inline-flex items-center gap-2">
          <span className="text-xs bg-white text-blue-500 px-2 py-0.5 rounded-full font-semibold">페이증권</span>
          이자 혜택 받기
        </button>
      </div>
      {/* 충전 / 송금 버튼 */}
      <div className="flex justify-end mt-6 gap-3">
        <button onClick={() => setModalOpen(true)} className="bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-1.5 rounded-full text-sm">충전</button>
        <button onClick={() => setSendModalOpen(true)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded-full text-sm">송금</button>
      </div>

      {/* 충전 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white w-80 rounded-xl p-5 shadow-xl relative">
            <div className="text-lg font-bold mb-4">💳 얼마나 충전할까요?</div>
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500">✖</button>
            <div className="space-y-2">
              {amounts.map((amt) => (
                <button key={amt} className="quick-charge w-full bg-gray-100 hover:bg-gray-200 rounded py-2"
                  onClick={() => handleCharge(amt)}>{amt.toLocaleString()}원</button>
              ))}
              <button onClick={handleCustomCharge} className="w-full bg-blue-100 hover:bg-blue-200 rounded py-2 mt-2 font-semibold">직접 입력하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 송금 모달 */}
      {sendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white w-80 rounded-xl p-5 shadow-xl relative">
            <div className="text-lg font-bold mb-4">🏦 어디로 보낼까요?</div>
            <button onClick={() => setSendModalOpen(false)} className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500">✖</button>
            <div className="text-sm text-gray-500 mb-2">최근 보낸 계좌</div>
            <div className="border border-gray-200 rounded-md p-3 mb-4">
              <b>김도훈</b><br />
              국민 93930200979743
            </div>
            <button onClick={handleSend} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded">
              계좌번호 입력
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
