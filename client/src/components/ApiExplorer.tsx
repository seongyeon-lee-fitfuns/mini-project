'use client';
import { useState } from 'react';
import JsonEditor from '@/components/JsonEditor';

// 타입 정의 추가
interface ApiResponse {
  error?: any;
  data?: any;
}

interface ApiLog {
  method: string;
  url: string;
  requestBody?: string;
  response?: any;  // 응답 데이터 추가
  timestamp: number;
}

export default function ApiExplorer() {
  const [method, setMethod] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
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
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedBody = JSON.parse(requestBody);
      console.log('<---------\treques\t---------->');
      if (method.toLowerCase() !== 'get') {
        console.log('parsedBody', parsedBody);
      }
      console.log('method', method);
      console.log('url', url);
      const response = await fetch(`http://localhost:7350/${url}`, {
        method: method,
        ...(method.toLowerCase() !== 'get' && {
          body: JSON.stringify(parsedBody)
        })
      });

      const data = await response.json();
      console.log('<---------\tresponse\t---------->');
      console.log('response', data);
      setResponse(data);

      // 요청 로그 저장
      const newLog: ApiLog = {
        method,
        url,
        requestBody: method.toLowerCase() !== 'get' ? requestBody : undefined,
        response: data,
        timestamp: Date.now()
      };
      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      alert('요청 본문 JSON이 유효하지 않습니다.');
    }
  };

  const loadFromLog = (log: ApiLog) => {
    setMethod(log.method);
    setUrl(log.url);
    if (log.requestBody) {
      setRequestBody(log.requestBody);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold pb-4">API Explorer</h2>
      
      <div className="mb-3">
        <div className="flex justify-between">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex">
                <div className="flex">
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="form-select rounded-l border border-gray-300 py-2 px-3"
                  >
                    <option disabled value="">메소드 선택</option>
                    <option disabled className="text-muted">----</option>
                    {["get", "post", "put", "delete"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="healthcheck"
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
            {method.toLowerCase() !== 'get' && (
              <JsonEditor 
                value={requestBody} 
                onChange={setRequestBody} 
                height="500px" 
              />
            )}
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

      {/* 로그 섹션 수정 */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3">요청 기록</h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.timestamp}>
              <div 
                className={`flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer ${selectedLog?.timestamp === log.timestamp ? 'bg-gray-50' : ''}`}
                onClick={() => setSelectedLog(selectedLog?.timestamp === log.timestamp ? null : log)}
              >
                <div className="flex items-center space-x-3">
                  <span className="uppercase font-mono bg-gray-200 px-2 py-1 rounded text-sm">
                    {log.method}
                  </span>
                  <span className="text-gray-600">{log.url}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      loadFromLog(log);
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    다시 요청하기
                  </button>
                  <div className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* 상세 정보 패널 */}
              {selectedLog?.timestamp === log.timestamp && (
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">요청 정보</h4>
                      <div className="bg-white p-3 rounded border">
                        <div className="mb-2">
                          <span className="font-semibold">Method:</span> {log.method}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">URL:</span> {log.url}
                        </div>
                        {log.requestBody && (
                          <div>
                            <span className="font-semibold">Request Body:</span>
                            <div className="mt-2">
                              <JsonEditor
                                value={log.requestBody}
                                readOnly
                                height="200px"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">응답 정보</h4>
                      <div className="bg-white p-3 rounded border">
                        <JsonEditor
                          value={JSON.stringify(log.response, null, 2)}
                          readOnly
                          height="200px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              아직 요청 기록이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 