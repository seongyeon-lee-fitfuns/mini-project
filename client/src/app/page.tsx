'use client';

import { useState } from 'react';
import { API_METHODS, ApiRequest, ApiResponse } from '@/types/api';
import { callApi } from '@/utils/api';
import ApiExplorer from '@/components/ApiExplorer';

export default function Home() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleApiRequest = async (request: ApiRequest) => {
    const result = await callApi(request);
    setResponse(result);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API 테스트 웹서비스</h1>
      <ApiExplorer apiMethods={API_METHODS} onSubmit={handleApiRequest} response={response} />
    </main>
  );
}
