import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

  const tcs: TestCase[] = parseMarkdownToTCs(markdown);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧪 Markdown → API 테스트 케이스 생성기</h1>

      <MarkdownEditor markdown={markdown} onMarkdownChange={setMarkdown} />
      <TestCaseTable testCases={tcs} />
    </main>
  );
}