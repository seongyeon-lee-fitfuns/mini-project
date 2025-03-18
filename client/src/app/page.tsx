'use client';

import ApiExplorer from "@/components/ApiExplorer";


export default function Home() {

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 테스트 웹서비스</h1>
      <ApiExplorer />
    </main>
  );
}
