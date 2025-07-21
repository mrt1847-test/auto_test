import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { TestCaseTable } from "@/components/TestCaseTable";
import { parseMarkdownToTCs, TestCase } from "@/utils/parseMarkdownToTCs";

type ApiModel = "openai" | "gemini" | "claude";
type PromptDomain = "ecommerce" | "backoffice" | "mobile";

export default function App() {
  const [markdown, setMarkdown] = useState(`### POST /api/login

- 요청 바디:
  - email: string, required
  - password: string, required

- 성공 응답:
  - status: 200
  - body: { token: string }

- 실패 응답:
  - status: 401
  - body: { error: 'Invalid credentials' }`);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiModel, setApiModel] = useState<ApiModel>("gemini");
  const [domain, setDomain] = useState<PromptDomain>("ecommerce");

  const tcs: TestCase[] = parseMarkdownToTCs(markdown);

  // Gemini API 연동 예시
  const handleGenerateByAI = async () => {
    setLoading(true);
    setError("");
    setAiResult("");

    let endpoint = "";
    let body = {};

    switch (apiModel) {
      case "openai":
        endpoint = "/api/generate-testcases";
        body = { prompt: markdown, domain };
        break;
      case "gemini":
        endpoint = "/api/generate-tc";
        body = { prompt: markdown, domain };
        break;
      case "claude":
        endpoint = "/api/generate-claude-tc";
        body = { prompt: markdown, domain };
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        setAiResult(data.result);
      } else {
        setError(data.error || "AI API 호출 실패");
      }
    } catch (err) {
      setError("AI API 호출 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧪 Markdown → API 테스트 케이스 생성기</h1>

      <MarkdownEditor markdown={markdown} onMarkdownChange={setMarkdown} />

      <div className="flex items-center gap-4">
        <select
          value={apiModel}
          onChange={(e) => setApiModel(e.target.value as ApiModel)}
          className="px-4 py-2 border rounded"
        >
          <option value="gemini">Gemini</option>
          <option value="openai">GPT</option>
          <option value="claude">Claude</option>
        </select>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value as PromptDomain)}
          className="px-4 py-2 border rounded"
        >
          <option value="ecommerce">이커머스</option>
          <option value="backoffice">백오피스</option>
          <option value="mobile">모바일</option>
        </select>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleGenerateByAI}
          disabled={loading}
        >
          {loading ? "AI로 생성 중..." : "AI로 테스트케이스 생성"}
        </button>
        {error && <span className="text-red-500">{error}</span>}
      </div>

      {aiResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">AI가 생성한 테스트케이스</h2>
          <pre className="whitespace-pre-wrap">{aiResult}</pre>
        </div>
      )}

      <TestCaseTable testCases={tcs} />
    </main>
  );
}