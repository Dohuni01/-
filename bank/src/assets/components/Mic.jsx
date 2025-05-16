import React from "react";

function Mic({ onClick }) {
  return (
    <button
      className="fixed right-6 bottom-24 z-30 w-14 h-14 bg-[#fee500] hover:bg-[#ffe812] rounded-full shadow-lg flex items-center justify-center border-none transition text-[29px]"
      id="voice-btn"
      title="음성 질문"
      onClick={onClick}
      type="button"
    >
      <span className="text-[#191919]">🎤</span>
    </button>
  );
}

export default Mic;