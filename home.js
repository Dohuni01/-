//---------충전 및 송금 부분--------
let balance = 0;

// 잔액 표시 업데이트
function updateBalance() {
  document.getElementById('balance').textContent = balance.toLocaleString() + "원";
}

// 충전 모달
document.getElementById('chargeBtn').addEventListener('click', () => {
  document.getElementById('modal').style.display = "flex";
});
window.closeModal = function () {
  document.getElementById('modal').style.display = "none";
};
document.querySelectorAll('.quick-charge').forEach(btn => {
  btn.addEventListener('click', function () {
    const amount = parseInt(this.getAttribute('data-amount'));
    balance += amount;
    updateBalance();
    alert(amount.toLocaleString() + "원이 충전되었습니다.");
    closeModal();
  });
});
document.getElementById('customCharge').addEventListener('click', () => {
  const input = prompt("충전할 금액을 직접 입력하세요:");
  const amount = parseInt(input);
  if (!isNaN(amount) && amount > 0) {
    balance += amount;
    updateBalance();
    alert(amount + "원이 충전되었습니다.");
    closeModal();
  } else {
    alert("올바른 금액을 입력해주세요.");
  }
});

// 송금 모달
document.getElementById('sendBtn').addEventListener('click', () => {
  document.getElementById('sendModal').style.display = "flex";
});
window.closeSendModal = function () {
  document.getElementById('sendModal').style.display = "none";
};
document.getElementById('accountInputBtn').addEventListener('click', () => {
  const account = prompt("계좌번호를 입력하세요:");
  if (!account) return alert("계좌번호를 입력해야 합니다.");

  const amount = prompt("송금할 금액을 입력하세요:");
  const intAmount = parseInt(amount);
  if (isNaN(intAmount) || intAmount <= 0) return alert("올바른 금액을 입력해주세요.");
  if (intAmount > balance) return alert("잔액이 부족합니다.");

  balance -= intAmount;
  updateBalance();
  alert(account + " 계좌로 " + intAmount.toLocaleString() + "원을 송금했습니다.");
  closeSendModal();
});

updateBalance();
//---------충전 및 송금 ------------

// 1. 하단 네비게이션/서비스 버튼 클릭 시 이동
document.getElementById('nav-home').onclick = () => location.href = 'home.html';
document.getElementById('nav-benefit').onclick = () => location.href = 'benefit.html';
document.getElementById('nav-pay').onclick = () => location.href = 'pay.html';
document.getElementById('nav-money').onclick = () => location.href = 'money.html';
document.getElementById('nav-paper').onclick = () => location.href = 'paper.html';

// 주요 서비스 버튼 연결 (service-btn 순서: 결제/손해보험/카드만들기/대출비교/신용관리/보험진단/통신비할인/더보기)
document.querySelectorAll('.service-btn').forEach((btn, idx) => {
    btn.onclick = () => {
        switch (idx) {
            case 0: location.href = 'pay.html'; break;      // 결제
            case 1: location.href = 'money.html'; break;    // 손해보험→자산
            case 2: location.href = 'benefit.html'; break;  // 카드만들기→혜택
            case 3: location.href = 'money.html'; break;    // 대출비교→자산
            case 4: location.href = 'money.html'; break;    // 신용관리→자산
            case 5: location.href = 'money.html'; break;    // 보험진단→자산
            case 6: location.href = 'money.html'; break;    // 통신비할인→자산
            case 7: location.href = 'benefit.html'; break;  // 더보기→혜택
        }
    };
});

// 2. 음성 명령: 오직 GPT가 "페이지 이동: [파일명]" 답변할 때만 이동, 그 외는 TTS 답변
let isRecording = false;
let recognition = null;
let transcriptAll = '';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceBtn = document.getElementById('voice-btn');
if (!window.SpeechRecognition) {
    alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    voiceBtn.disabled = true;
} else {
    recognition = new window.SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
        transcriptAll = '';
        voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
    };
    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcriptAll += event.results[i][0].transcript;
        }
    };
    recognition.onerror = (event) => {
        isRecording = false;
        voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
    };
    recognition.onend = () => {
        isRecording = false;
        voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
        const userSpeech = transcriptAll.trim();
        if (!userSpeech) return;

        // 🔥 음성 합성(TTS) 중이면 즉시 중단
        window.speechSynthesis.cancel();

        fetch('http://localhost:3000/askgpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: userSpeech })
        })
            .then(r => r.json())
            .then(data => {
                let answer = (data.answer || '응답이 없습니다.');
                // "페이지 이동: [파일명]" 패턴이면 이동, 아니면 TTS
                const moveMatch = answer.match(/페이지 이동: (home\.html|benefit\.html|pay\.html|money\.html|paper\.html)/);
                if (moveMatch) {
                    location.href = moveMatch[1];
                } else {
                    const tts = new SpeechSynthesisUtterance(answer);
                    tts.lang = 'ko-KR';
                    window.speechSynthesis.speak(tts);
                }
            })
            .catch(err => {
                // 실패시에도 UI 변화 없음
            });
    };

    voiceBtn.onclick = function () {
        // 🔥 음성 합성(TTS) 중이면 즉시 중단
        window.speechSynthesis.cancel();

        if (!isRecording) {
            recognition.start();
            isRecording = true;
            voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
        } else {
            recognition.stop();
        }
    };
}