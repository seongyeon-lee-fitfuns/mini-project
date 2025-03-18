'use client';

import { useState } from 'react';
import { ApiMethod, ApiRequest, ApiResponse } from '@/types/api';
import JsonEditor from '@/components/JsonEditor';

interface ApiExplorerProps {
  apiMethods: ApiMethod[];
  onSubmit: (request: ApiRequest) => Promise<void>;
  response: ApiResponse | null;
}

export default function ApiExplorer({ apiMethods, onSubmit, response }: ApiExplorerProps) {
  const [method, setMethod] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>(`{
  "account": {
    "id": "<string>",
    "vars": {
      "<string>": "<string>"
    }
  },
  "create": false,
  "username": "<string>"
}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedBody = JSON.parse(requestBody);
      
      const request: ApiRequest = {
        method,
        userId,
        body: parsedBody
      };
      
      await onSubmit(request);
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      alert('요청 본문 JSON이 유효하지 않습니다.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold pb-4">API Explorer</h2>
      
      <div className="mb-3">
        <div className="flex justify-between">
          <div className="w-3/4">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex">
                <div className="flex-shrink-0">
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="form-select rounded-l border border-gray-300 py-2 px-3"
                  >
                    <option disabled value="">API 메소드 선택</option>
                    <option disabled className="text-muted">----</option>
                    {apiMethods.map((api) => (
                      <option key={api.value} value={api.value}>
                        {api.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="요청 컨텍스트로 사용자 ID 설정"
                  className="flex-grow border border-gray-300 px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                >
                  요청 보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 py-3">
          <h5 className="font-bold">요청 본문</h5>
          <hr className="mb-4" />
          <div className="border rounded p-2 mb-3 h-[500px]">
            <JsonEditor 
              value={requestBody} 
              onChange={setRequestBody} 
              height="500px" 
            />
          </div>
        </div>
        
        <div className="w-1/2 pl-3 py-3">
          <h5 className="font-bold">응답</h5>
          <hr className="mb-4" />
          <div className="border rounded p-2 mb-3 h-[500px]">
            <JsonEditor 
              value={response ? JSON.stringify(response.error || response.data, null, 2) : ''} 
              readOnly 
              height="500px"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 