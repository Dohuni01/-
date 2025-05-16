//---------충전 및 송금 부분--------
let balance = 0;

// 잔액 표시 업데이트
function updateBalance() {
    document.getElementById('balance').textContent = balance.toLocaleString() + "원";
}

// 충전 모달 (버튼 UI)
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

// 송금 모달 (버튼 UI)
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

// 하단 네비게이션/서비스 버튼 클릭 시 이동
document.getElementById('nav-home').onclick = () => location.href = 'home.html';
document.getElementById('nav-benefit').onclick = () => location.href = 'benefit.html';
document.getElementById('nav-pay').onclick = () => location.href = 'pay.html';
document.getElementById('nav-money').onclick = () => location.href = 'money.html';
document.getElementById('nav-paper').onclick = () => location.href = 'paper.html';

// 주요 서비스 버튼 연결
document.querySelectorAll('.service-btn').forEach((btn, idx) => {
    btn.onclick = () => {
        switch (idx) {
            case 0: location.href = 'pay.html'; break;
            case 1: case 3: case 4: case 5: case 6: location.href = 'money.html'; break;
            case 2: case 7: location.href = 'benefit.html'; break;
        }
    };
});

// =========================
// 음성 명령 및 충전 플로우
// =========================
let isRecording = false;
let recognition = null;
let transcriptAll = '';
let INIT_PASSWORD = "1234";
let passwordTry = 0;

// 1. 전역 기본 핸들러 함수 정의
function mainRecognitionHandler(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcriptAll += event.results[i][0].transcript;
    }
}

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
    recognition.onerror = (event) => {
        isRecording = false;
        voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
    };

    // 핵심! 마이크 버튼 클릭 시 마다 기본 핸들러 등록
    voiceBtn.onclick = function () {
        window.speechSynthesis.cancel();
        if (!isRecording) {
            transcriptAll = '';
            recognition.onresult = mainRecognitionHandler;
            recognition.onend = function() {
                isRecording = false;
                voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                // 메인 명령 파싱/실행!
                const userSpeech = transcriptAll.trim();
                if (!userSpeech) return;

                window.speechSynthesis.cancel();

                fetch('http://localhost:3000/askgpt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: userSpeech })
                })
                    .then(res => res.json())
                    .then(data => {
                        let answer = (data.answer || '응답이 없습니다.');
                        // 페이지 이동 명령
                        const moveMatch = answer.match(/페이지 이동: (home\.html|benefit\.html|pay\.html|money\.html|paper\.html)/);
                        if (moveMatch) {
                            location.href = moveMatch[1];
                            return;
                        }
                        const cmdMatch = answer.match(/명령: (\w+)/);

                        const actionMap = {
                            charge: () => {
                                passwordTry = 0;
                                askPasswordVoice();
                            },
                            send: () => document.getElementById('sendModal').style.display = "flex",
                            change: () => {
                                const change = new SpeechSynthesisUtterance(`현재 남은 금액은 ${balance.toLocaleString()}원 입니다.`);
                                change.lang = 'ko-KR';
                                window.speechSynthesis.speak(change);
                            }
                        };

                        if (cmdMatch && actionMap[cmdMatch[1]]) {
                            actionMap[cmdMatch[1]]();
                            return;
                        }
                        // 나머지 응답은 TTS로
                        const tts = new SpeechSynthesisUtterance(answer);
                        tts.lang = 'ko-KR';
                        window.speechSynthesis.speak(tts);
                    })
                    .catch(err => {});
            };
            recognition.start();
            isRecording = true;
            voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
        } else {
            recognition.stop();
        }
    };
}

// ===================
// 음성 기반 충전 플로우 함수 정의 (각각 끝나면 전역 핸들러 복구!)
// ===================

function askPasswordVoice() {
    const askPW = new SpeechSynthesisUtterance("비밀번호를 말씀해 주세요.");
    askPW.lang = 'ko-KR';
    window.speechSynthesis.speak(askPW);

    askPW.onend = () => {
        if (recognition) {
            recognition.onresult = function(event) {
                let pwSpeech = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    pwSpeech += event.results[i][0].transcript;
                }
                pwSpeech = pwSpeech.replace(/ /g, '').trim();

                let pwNum = passwordToNumber(pwSpeech);
                recognition.onresult = mainRecognitionHandler; // 복구!
                recognition.onerror = null;
                recognition.onend = null;

                if (pwNum === INIT_PASSWORD) {
                    isRecording = false;
                    voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                    askChargeAmountVoice();
                } else {
                    passwordTry++;
                    isRecording = false;
                    voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                    if (passwordTry < 3) {
                        const wrongPW = new SpeechSynthesisUtterance("비밀번호 오류입니다. 다시 말해 주세요.");
                        wrongPW.lang = 'ko-KR';
                        window.speechSynthesis.speak(wrongPW);
                        wrongPW.onend = () => {
                            askPasswordVoice();
                        }
                    } else {
                        const failPW = new SpeechSynthesisUtterance("비밀번호 입력 3회 실패. 충전이 취소됩니다.");
                        failPW.lang = 'ko-KR';
                        window.speechSynthesis.speak(failPW);
                    }
                }
            };
            recognition.onerror = recognition.onend = function() {
                isRecording = false;
                voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                recognition.onresult = mainRecognitionHandler;
            };
            recognition.start();
            isRecording = true;
            voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
        }
    };
}

function askChargeAmountVoice() {
    const askAmount = new SpeechSynthesisUtterance("얼마 충전할까요?");
    askAmount.lang = 'ko-KR';
    window.speechSynthesis.speak(askAmount);

    askAmount.onend = () => {
        if (recognition) {
            recognition.onresult = function(event) {
                let amountSpeech = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    amountSpeech += event.results[i][0].transcript;
                }
                amountSpeech = amountSpeech.trim();

                // 🟡 AI Agent가 자연어 금액을 숫자로 파싱
                fetch('http://localhost:3000/extractamount', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ speech: amountSpeech })
                })
                .then(res => res.json())
                .then(data => {
                    let num = parseInt(data.amount) || 0;
                    recognition.onresult = mainRecognitionHandler;
                    recognition.onerror = null;
                    recognition.onend = null;

                    if (num > 0) {
                        confirmChargeVoice(num);
                    } else {
                        window.speechSynthesis.cancel();
                        const tts = new SpeechSynthesisUtterance("금액을 다시 말씀해 주세요.");
                        tts.lang = 'ko-KR';
                        window.speechSynthesis.speak(tts);
                        isRecording = false;
                        voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                    }
                });
            };
            recognition.onerror = recognition.onend = function() {
                isRecording = false;
                voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                recognition.onresult = mainRecognitionHandler;
            };
            recognition.start();
            isRecording = true;
            voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
        }
    };
}


function confirmChargeVoice(amount) {
    const askConfirm = new SpeechSynthesisUtterance(`${amount.toLocaleString()}원 충전해드릴까요?`);
    askConfirm.lang = 'ko-KR';
    window.speechSynthesis.speak(askConfirm);

    askConfirm.onend = () => {
        if (recognition) {
            recognition.onresult = function(event) {
                let answer = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    answer += event.results[i][0].transcript;
                }
                answer = answer.trim();

                // 서버에 긍정/부정 판정 요청!
                fetch('http://localhost:3000/checkyesno', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answer })
                })
                .then(res => res.json())
                .then(data => {
                    recognition.onresult = mainRecognitionHandler; // 복구!
                    recognition.onerror = null;
                    recognition.onend = null;

                    if (data.result === 'yes') {
                        balance += amount;
                        updateBalance();
                        const tts = new SpeechSynthesisUtterance(
                            `${amount.toLocaleString()}원이 충전되었습니다. 현재 잔고는 ${balance.toLocaleString()}원 입니다.`
                        );
                        tts.lang = 'ko-KR';
                        window.speechSynthesis.speak(tts);
                    } else if (data.result === 'no') {
                        const tts = new SpeechSynthesisUtterance("충전이 취소되었습니다.");
                        tts.lang = 'ko-KR';
                        window.speechSynthesis.speak(tts);
                    } else {
                        const tts = new SpeechSynthesisUtterance("네 또는 아니요로 대답해 주세요.");
                        tts.lang = 'ko-KR';
                        window.speechSynthesis.speak(tts);
                    }
                });
                isRecording = false;
                voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
            };
            recognition.onerror = recognition.onend = function() {
                isRecording = false;
                voiceBtn.innerHTML = '<span class="voice-icon">&#127908;</span>';
                recognition.onresult = mainRecognitionHandler;
            };
            recognition.start();
            isRecording = true;
            voiceBtn.innerHTML = '<span class="voice-icon">⏹️</span>';
        }
    };
}

// ====== 유틸 함수: 비밀번호(한글/숫자) → 숫자열 ======
function passwordToNumber(str) {
    const hangulNum = {
        "공": "0", "영": "0",
        "일": "1", "이": "2", "삼": "3", "사": "4", "오": "5",
        "육": "6", "륙": "6", "칠": "7", "팔": "8", "구": "9"
    };
    let numStr = "";
    for (let ch of str) {
        if (hangulNum[ch] !== undefined) numStr += hangulNum[ch];
        else if (ch >= '0' && ch <= '9') numStr += ch;
    }
    return numStr;
}

// ====== 유틸 함수: 한글/숫자 금액 인식 ======
function extractNumberFromSpeech(str) {
    // 콤마 제거
    str = str.replace(/,/g, '').replace(/ /g, '');

    // 우선 숫자만 있는 경우
    const numberMatch = str.match(/\d{3,}/);
    if (numberMatch) return parseInt(numberMatch[0]);

    // 한글 단위 변환용
    const numWord = {
        '공': 0, '영': 0, '일': 1, '이': 2, '삼': 3, '사': 4, '오': 5,
        '육': 6, '륙': 6, '칠': 7, '팔': 8, '구': 9
    };
    const unitWord = {
        '십': 10, '백': 100, '천': 1000, '만': 10000, '억': 100000000
    };

    // "이백오십삼만 사천십이" 등 한글 숫자 처리
    let result = 0, tmp = 0, num = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (numWord[ch] !== undefined) {
            num = numWord[ch];
        } else if (unitWord[ch]) {
            // 단위(십, 백, 천, 만, 억 등)
            if (num === 0) num = 1;
            tmp += num * unitWord[ch];
            num = 0;
            // 만, 억 단위는 누적해서 result에 더함
            if (ch === '만' || ch === '억') {
                result += tmp;
                tmp = 0;
            }
        }
    }
    result += tmp + num;
    if (result > 0) return result;

    // "삼십만", "이백만", "오천만" 등 특수 표기
    if (str.includes("십만")) return 100000 * (numWord[str[0]] || 1);
    if (str.includes("백만")) return 1000000 * (numWord[str[0]] || 1);
    if (str.includes("천만")) return 10000000 * (numWord[str[0]] || 1);

    // "이백만원" "백만원" 등 단위 혼합
    const man = str.match(/([공영일이삼사오육륙칠팔구]?)백만/);
    if (man) return (numWord[man[1]] || 1) * 1000000;

    return 0;
}