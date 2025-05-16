import React, { useEffect, useRef, useState } from "react";

const FILES = ["home.html", "benefit.html", "pay.html", "money.html", "paper.html"];

export default function Mic() {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // 누적 텍스트
  const btnRef = useRef();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      if (btnRef.current) btnRef.current.disabled = true;
      return;
    }
    // 음성 인식 객체 초기화
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.continuous = false;

    // 이벤트 핸들러
    recognition.onstart = () => {
      transcriptRef.current = "";
      setIsRecording(true);
      if (btnRef.current) btnRef.current.innerHTML = '<span class="text-[#191919]">⏹️</span>';
    };
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcriptRef.current += event.results[i][0].transcript;
      }
    };
    recognition.onerror = () => {
      setIsRecording(false);
      if (btnRef.current) btnRef.current.innerHTML = '<span class="text-[#191919]">&#127908;</span>';
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (btnRef.current) btnRef.current.innerHTML = '<span class="text-[#191919]">&#127908;</span>';
      const userSpeech = transcriptRef.current.trim();
      if (!userSpeech) return;
      // TTS 취소
      window.speechSynthesis.cancel();
      // GPT 요청
      fetch("http://localhost:3000/askgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userSpeech })
      })
        .then(r => r.json())
        .then(data => {
          let answer = data.answer || "응답이 없습니다.";
          const moveMatch = answer.match(/페이지 이동: (home\.html|benefit\.html|pay\.html|money\.html|paper\.html)/);
          if (moveMatch) {
            window.location.href = moveMatch[1];
          } else {
            const tts = new window.SpeechSynthesisUtterance(answer);
            tts.lang = "ko-KR";
            window.speechSynthesis.speak(tts);
          }
        });
    };

    recognitionRef.current = recognition;

    // cleanup
    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const onMicClick = () => {
    window.speechSynthesis.cancel();
    if (!isRecording) {
      recognitionRef.current && recognitionRef.current.start();
    } else {
      recognitionRef.current && recognitionRef.current.stop();
    }
  };

  return (
    <button
      ref={btnRef}
      className="fixed right-6 bottom-24 z-30 w-14 h-14 bg-[#fee500] hover:bg-[#ffe812] rounded-full shadow-lg flex items-center justify-center border-none transition text-[29px]"
      id="voice-btn"
      title="음성 질문"
      onClick={onMicClick}
    >
      <span className="text-[#191919]">&#127908;</span>
    </button>
  );
}
