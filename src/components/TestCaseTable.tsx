import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TestCase } from "@/utils/parseMarkdownToTCs";

interface TestCaseTableProps {
  testCases: TestCase[];
}

export const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>TC ID</TableHead>
          <TableHead>설명</TableHead>
          <TableHead>입력</TableHead>
          <TableHead>기대 응답</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testCases.map((tc) => (
          <TableRow key={tc.id}>
            <TableCell>{tc.id}</TableCell>
            <TableCell>{tc.description}</TableCell>
            <TableCell>{tc.input}</TableCell>
            <TableCell>{tc.expected}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};