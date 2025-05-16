require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const pages = [
    { name: "홈", file: "home.html" },
    { name: "혜택", file: "benefit.html" },
    { name: "결제", file: "pay.html" },
    { name: "자산", file: "money.html" },
    { name: "머니", file: "money.html" },
    { name: "증권", file: "paper.html" },
    { name: "페이퍼", file: "paper.html" }
];

// askgpt: 페이지/명령/상담
app.post('/askgpt', async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) return res.status(400).json({ answer: '질문이 없습니다.' });

        const prompt = `
아래는 사용자가 카카오페이 홈/자산/결제/혜택/증권 페이지에서 음성명령으로 요청하는 내용이야.
- "페이지 이동" 명령 시 반드시 아래 파일명 중 하나로만 이동:
  - home.html (홈)
  - benefit.html (혜택)
  - pay.html (결제)
  - money.html (자산/머니)
  - paper.html (증권/페이퍼)
- 충전 명령 → "명령: charge"
- 송금 명령 → "명령: send"
- 잔액 질의 → "명령: change"
- 단순 정보/상담/공감은 자연스럽게 답변.

[사용자 질문]
${question}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 400,
        });

        const answer = completion.choices[0].message.content;
        res.json({ answer });
    } catch (err) {
        res.json({ answer: `에러 발생: ${err.message}` });
    }
});

// 긍/부정 판별
app.post('/checkyesno', async (req, res) => {
    try {
        const userAnswer = req.body.answer;
        if (!userAnswer) return res.status(400).json({ result: 'unknown', error: 'no answer given' });
        const prompt = `
아래 답변이 "네"인지 "아니요"인지 판단해서 yes, no, unknown으로만 답하세요.
예시 - yes: 네, 예, 진행시켜, 충전해줘, 맞아요 등
예시 - no: 아니요, 싫어, 안돼 등
예시 - unknown: 잘 모르겠어, 음...
[답변]
${userAnswer}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 10,
        });

        const gptAnswer = completion.choices[0].message.content.trim().toLowerCase();
        res.json({ result: gptAnswer });
    } catch (err) {
        res.json({ result: 'unknown', error: err.message });
    }
});

// 🔥 자연어 금액을 AI로 정수로 변환
app.post('/extractamount', async (req, res) => {
    try {
        const speech = req.body.speech || "";
        const prompt = `
아래 한국어 금액 표현을 숫자(정수)로만 답하세요. 단위는 무시. "삼만오천원" → 35000, "이십오만" → 250000 등.
이상하거나 금액 없으면 0만 답하세요.
[금액]
${speech}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }],
            max_tokens: 12,
        });

        const answer = completion.choices[0].message.content.trim();
        const onlyNum = answer.replace(/[^\d]/g, "");
        res.json({ amount: onlyNum || "0" });

    } catch (err) {
        res.json({ amount: "0", error: err.message });
    }
});

app.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중!');
});
