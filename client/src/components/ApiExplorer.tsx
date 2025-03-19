'use client';
import { useState } from 'react';
import JsonEditor from '@/components/JsonEditor';
import ApiRequestForm from '@/components/ApiRequestForm';
import ApiLogList from '@/components/ApiLogList';
import { ApiResponse, ApiLog } from '@/types/api';

export default function ApiExplorer() {
  const [method, setMethod] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [requestBody, setRequestBody] = useState<string>(`{
  "username": "admin",
  "password": "password"
}`);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedBody = JSON.parse(requestBody);
      const response = await fetch(url, {
        method: method,
        ...(method.toLowerCase() !== 'get' && {
          body: JSON.stringify(parsedBody)
        })
      });

      const data = await response.json();
      setResponse(data);

      const newLog: ApiLog = {
        method,
        url,
        requestBody: method.toLowerCase() !== 'get' ? requestBody : undefined,
        response: data,
        timestamp: Date.now()
      };
      setLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error('오류:', error);
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
            <ApiRequestForm
              method={method}
              url={url}
              onMethodChange={setMethod}
              onUrlChange={setUrl}
              onSubmit={handleSubmit}
            />
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
              value={JSON.stringify(response, null, 2)} 
              readOnly 
              height="500px"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3">요청 기록</h3>
        <ApiLogList
          logs={logs}
          selectedLog={selectedLog}
          onLogSelect={setSelectedLog}
          onLogReload={loadFromLog}
        />
      </div>
    </div>
  );
} 