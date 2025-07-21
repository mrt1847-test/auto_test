const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = 4000; // 원하는 포트로 변경 가능

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-testcases", async (req, res) => {
  const { apiSpec } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 환경변수로 관리 권장

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API Key not set" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // 또는 gpt-4
        messages: [
          { role: "system", content: "당신은 API 테스트 케이스를 잘 만드는 전문가입니다." },
          { role: "user", content: `아래 API 스펙 문서를 참고해서 테스트 케이스를 마크다운 표로 만들어줘.\n\n${apiSpec}` }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "OpenAI API 호출 실패", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 