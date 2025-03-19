'use client';
import { useState, useEffect } from 'react';
import JsonEditor from '@/components/JsonEditor';
import ApiRequestForm from '@/components/ApiRequestForm';
import ApiLogList from '@/components/ApiLogList';
import { ApiResponse, ApiLog } from '@/types/api';

export default function ApiExplorer() {
  const [method, setMethod] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [requestBody, setRequestBody] = useState<string>(`{
  "username": "admin",
  "password": "password"
}`);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('apiLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem('apiLogs', JSON.stringify(logs));
    }
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedBody = requestBody ? JSON.parse(requestBody) : {};
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;

      const urlObject = new URL(url.startsWith('http') ? url : `http://${url}`);
      const port = urlObject.port;

      const finalHeaders = {
        ...parsedHeaders
      };

      if (port === '7351') {
        finalHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: method,
        headers: finalHeaders,
        ...(method.toLowerCase() !== 'get' && {
          body: JSON.stringify(parsedBody)
        })
      });

      const data = await response.json();
      setResponse(data);

      const newLog: ApiLog = {
        method,
        url,
        headers: finalHeaders,
        requestBody: method.toLowerCase() !== 'get' ? requestBody : undefined,
        response: data,
        status: response.status,
        timestamp: Date.now()
      };
      
      setLogs(prev => {
        const newLogs = [newLog, ...prev].slice(0, 50);
        return newLogs;
      });
    } catch (error) {
      console.error('오류:', error);
      setResponse({ error: error });
    }
  };

  const loadFromLog = (log: ApiLog) => {
    setMethod(log.method);
    setUrl(log.url);
    if (log.headers) {
      setHeaders(JSON.stringify(log.headers, null, 2));
    }
    if (log.requestBody) {
      setRequestBody(log.requestBody);
    }
  };

  const handleLogDelete = (timestamp: number) => {
    setLogs(prev => {
      const newLogs = prev.filter(log => log.timestamp !== timestamp);
      localStorage.setItem('apiLogs', JSON.stringify(newLogs));
      return newLogs;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('apiLogs');
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
              headers={headers}
              onMethodChange={setMethod}
              onUrlChange={setUrl}
              onHeadersChange={setHeaders}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 py-3">
          <h5 className="font-bold">요청 본문</h5>
          <hr className="mb-4" />
          <div className="border rounded p-2 mb-3">
            {method.toLowerCase() !== 'get' && (
              <JsonEditor 
                value={requestBody} 
                onChange={setRequestBody} 
              />
            )}
          </div>
        </div>
        
        <div className="w-1/2 pl-3 py-3">
          <h5 className="font-bold">응답</h5>
          <hr className="mb-4" />
          <div className="border rounded p-2 mb-3">
            <JsonEditor 
              value={JSON.stringify(response, null, 2)} 
              readOnly 
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">요청 기록</h3>
          <button
            onClick={clearLogs}
            className="text-red-500 hover:text-red-600 text-sm"
          >
            모든 기록 지우기
          </button>
        </div>
        <ApiLogList
          logs={logs}
          selectedLog={selectedLog}
          onLogSelect={setSelectedLog}
          onLogReload={loadFromLog}
          onLogDelete={handleLogDelete}
        />
      </div>
    </div>
  );
} 