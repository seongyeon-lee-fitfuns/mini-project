'use client';
import ApiExplorer from "@/components/ApiExplorer";

export default function Home() {

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 테스트 웹서비스</h1>
      <ApiExplorer />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">참고 문서</h2>
        <p>
          API 문서는{' '}
          <a 
            href="https://heroiclabs.com/docs/nakama/api/console/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Heroic Labs Nakama API 문서
          </a>
          를 참고해 주세요.
        </p>
      </div>
    </main>
  );
}
