const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = 4000; // 원하는 포트로 변경 가능

app.use(cors());
app.use(bodyParser.json());

// 공통 프롬프트
const COMMON_PROMPT = `
너는 숙련된 QA 엔지니어야. 아래 마크다운 형식의 API 스펙 문서를 기반으로 테스트 케이스를 작성해줘.

- 테스트 케이스는 JSON 배열로 출력해.
- 각 테스트 케이스는 다음 필드를 포함해:
  - id: TC-001 형태
  - description: 목적이 명확한 한 줄 설명
  - input: 입력 파라미터나 조건
  - expected: 기대되는 응답 결과 또는 상태

- 정상 케이스와 다양한 실패/예외 케이스를 포함해줘. 예:
  - 필수 입력값 누락
  - 잘못된 형식
  - 비즈니스 로직 위반 (ex: 비밀번호 불일치)
  - 인증 실패, 권한 부족 등

- 입력이 숫자, 이메일, 날짜 등일 경우 유효하지 않은 값 테스트도 고려해.
`;

// 분야별 특화 프롬프트
const PROMPTS = {
  ecommerce: `
- 상품 상세, 장바구니, 결제, 주문 확인 등 주요 사용자 플로우를 모두 고려해.
- 실패 케이스는 다음을 반드시 포함해:
  - 품절 상품 구매 시도
  - 장바구니에 없는 상품 주문
  - 잘못된 결제 수단(만료/잔액 부족/미등록 카드 등)
  - 미인증 사용자 접근(비로그인 상태)
  - 잘못된 상품 ID, 잘못된 수량 등 입력값 오류
- 경계 조건(예: 최대/최소 수량, 최대 결제 금액 등)도 테스트해.
- 설명은 한글로, input과 expected는 실제 API 요청/응답 예시로 구체적으로 작성해.
`,
  backoffice: `
- 접근 권한(관리자/일반 사용자/비로그인), 필터링, 페이징, 정렬, 검색 등 다양한 기능을 모두 고려해.
- 실패 케이스는 다음을 반드시 포함해:
  - 관리자 권한이 없는 사용자의 접근 시도
  - 잘못된 필터/정렬 파라미터
  - 페이지 번호/사이즈의 경계값(0, 음수, 최대값 등)
- 설명은 한글로, input과 expected는 실제 API 요청/응답 예시로 구체적으로 작성해.
`,
  mobile: `
- 네트워크 오류/지연, 동일 사용자 중복 요청, 앱 토큰 만료/갱신, 오프라인 상태 등 모바일 환경 특수 상황을 반드시 포함해.
- 실패 케이스는 다음을 반드시 포함해:
  - 네트워크 지연/끊김 상황에서의 요청
  - 만료된/잘못된 토큰으로 요청
  - 동일 요청을 여러 번 빠르게 반복(중복 주문 등)
  - 앱 버전이 낮은 경우(구버전 지원 여부)
- 설명은 한글로, input과 expected는 실제 API 요청/응답 예시로 구체적으로 작성해.
`,
};

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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/generate-tc", async (req, res) => {
  const { prompt, domain } = req.body; // domain: 'ecommerce', 'backoffice', 'mobile'
  const domainPrompt = PROMPTS[domain] || "";
  const systemPrompt = `${COMMON_PROMPT}\n${domainPrompt}\n아래는 테스트 대상이 되는 API 스펙이야:\n${prompt}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No result";

    res.json({ result: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API 요청 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 