const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'api'; // 본인 OpenAI API 키 입력

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.post('/askgpt', async (req, res) => {
    try {
        const question = req.body.question;
        if (!question) {
            return res.status(400).json({ answer: '질문이 없습니다.' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            max_tokens: 400,
        });

        const answer = completion.choices[0].message.content;
        res.json({ answer });
    } catch (err) {
        res.json({ answer: `에러 발생: ${err.message}` });
    }
});

app.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중!');
});
