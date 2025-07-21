import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { TestCaseTable } from "@/components/TestCaseTable";
import { parseMarkdownToTCs, TestCase } from "@/utils/parseMarkdownToTCs";

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

  const tcs: TestCase[] = parseMarkdownToTCs(markdown);

  // Gemini API 연동 예시
  const handleGenerateByAI = async () => {
    setLoading(true);
    setError("");
    setAiResult("");
    try {
      const response = await fetch("/api/generate-tc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: markdown }),
      });
      const data = await response.json();
      setAiResult(data.result);
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