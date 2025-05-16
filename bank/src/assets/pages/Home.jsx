// src/pages/Home.jsx
import React from "react";

// components
import Header from "../components/Header.jsx";
import Navigation from "../components/Navigation.jsx";
import Mic from "../components/Mic.jsx";
const Home = () => {
  return (
    <div className="bg-[#f7f8fa] min-h-screen relative font-sans">
      {/* 상단 헤더 */}
      <Header />
      {/* 페이머니 박스 */}
      <div className="bg-white rounded-[18px] mx-3 mt-3 px-5 py-4 shadow flex flex-col gap-2">
        <div className="flex items-center text-[15px] text-gray-400 gap-1">
          <span className="font-medium text-[#6e6e6e]">페이머니</span>
          <span className="mx-1 text-[7px]">•</span>
          <span className="text-[#b2b2b2]">pay</span>
          <span className="mx-1 text-[7px]">•</span>
          <span className="text-[13px] text-[#bbb]">증권 <span title="i">ⓘ</span></span>
        </div>
        <div className="flex items-end my-2">
          <span className="text-[28px] font-bold text-[#222] mr-2 bg-white">1,000,000원</span>
          <span className="text-[17px] text-[#b2b2b2] ml-1">&#8250;</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button className="bg-[#1887fc] hover:bg-[#309eff] text-white text-[14px] rounded-[12px] px-4 py-1 font-medium shadow transition">2원 이자 받기</button>
          <div className="flex-1"></div>
          <button className="bg-[#ececec] hover:bg-[#f8fafd] text-[#444] text-[15px] rounded-[8px] px-4 py-1 font-medium transition">충전</button>
          <button className="bg-[#ffe812] hover:bg-[#fff275] text-[#222] text-[15px] rounded-[8px] px-4 py-1 font-bold transition">송금</button>
        </div>
      </div>
      {/* 이하 내용 동일하게 컴포넌트화 (배너, 서비스, 광고, 내역 등) */}
      {/* ... */}
      <Navigation />
      <Mic />
    </div>
  );
};

export default Home;
