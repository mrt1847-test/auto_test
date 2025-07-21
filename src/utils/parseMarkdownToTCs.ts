export interface TestCase {
    id: string;
    description: string;
    input: string;
    expected: string;
  }
  
  export function parseMarkdownToTCs(markdown: string): TestCase[] {
    const lines = markdown.split("\n");
    const tcs: TestCase[] = [];
    let id = 1;
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("### ")) {
        const methodAndUrl = line.replace("### ", "").trim();
        const inputs: string[] = [];
        let success = "";
        let failure = "";
  
        for (let j = i + 1; j < lines.length; j++) {
          const subLine = lines[j].trim();
          if (subLine.startsWith("### ")) break;
          if (subLine.startsWith("- 요청 바디:")) {
            while (++j < lines.length && lines[j].trim().startsWith("-")) {
              inputs.push(lines[j].replace("-", "").trim());
            }
            j--;
          }
          if (subLine.startsWith("- 성공 응답:")) {
            success = lines[j + 1]?.trim() + " / " + lines[j + 2]?.trim();
          }
          if (subLine.startsWith("- 실패 응답:")) {
            failure = lines[j + 1]?.trim() + " / " + lines[j + 2]?.trim();
          }
        }
  
        tcs.push({
          id: `TC-${id++}`,
          description: `정상 ${methodAndUrl} 요청`,
          input: inputs.join(", "),
          expected: success,
        });
  
        inputs.forEach((input) => {
          tcs.push({
            id: `TC-${id++}`,
            description: `${input.split(":")[0]} 누락 시 실패`,
            input: inputs.filter((i) => i !== input).join(", "),
            expected: failure,
          });
        });
      }
    }
  
    return tcs;
  }
  