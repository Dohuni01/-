// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Mic from "../components/Mic";
import SwipePage from "../components/SwipePage";
const NAVS = [
  { label: "자산", to: "/money", color: "bg-blue-500" },
  { label: "혜택", to: "/benefit", color: "bg-green-500" },
  { label: "충전", to: "/charge", color: "bg-yellow-400" },
  { label: "결제", to: "/pay", color: "bg-indigo-500" }
];

function speakText(text) {
  const tts = new window.SpeechSynthesisUtterance(text);
  tts.lang = "ko-KR";
  window.speechSynthesis.speak(tts);
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <SwipePage>
    <div className="bg-[#f7f8fa] min-h-screen flex flex-col justify-center items-center px-2">
      <div className="w-full max-w-sm flex flex-col gap-6 py-10">
        {NAVS.map(({ label, to, color }) => (
          <button
            key={label}
            className={`w-full h-24 text-2xl font-bold rounded-2xl text-white shadow-md active:scale-95 transition ${color}`}
            onClick={() => navigate(to)}
            onPointerDown={e => {
              // 롱프레스 구현: 500ms 이상 누르면 안내, 짧게 떼면 이동
              let pressed = false;
              const timeout = setTimeout(() => {
                pressed = true;
                speakText(`${label} 버튼`);
              }, 500);
              e.target.onpointerup = () => {
                clearTimeout(timeout);
                if (!pressed) {
                  // 짧게 떼면 이동
                  navigate(to);
                }
                e.target.onpointerup = null;
              };
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <Mic />
    </div>
    </SwipePage>
  );
}
