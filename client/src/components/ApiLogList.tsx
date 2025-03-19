import { ApiLog } from '@/types/api';
import JsonEditor from '@/components/JsonEditor';

interface ApiLogListProps {
  logs: ApiLog[];
  selectedLog: ApiLog | null;
  onLogSelect: (log: ApiLog | null) => void;
  onLogReload: (log: ApiLog) => void;
  onLogDelete: (timestamp: number) => void;
}

export default function ApiLogList({ logs, selectedLog, onLogSelect, onLogReload, onLogDelete }: ApiLogListProps) {
  // 상태 코드에 따른 색상 결정
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.timestamp}>
          <div 
            className={`flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer ${selectedLog?.timestamp === log.timestamp ? 'bg-gray-50' : ''}`}
            onClick={() => onLogSelect(selectedLog?.timestamp === log.timestamp ? null : log)}
          >
            <div className="flex items-center space-x-3">
              <span className="uppercase font-mono bg-gray-200 px-2 py-1 rounded text-sm">
                {log.method}
              </span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
              <span className="text-gray-600">{log.url}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLogReload(log);
                }}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                다시 요청하기
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogDelete(log.timestamp);
                }}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                삭제
              </button>
              <div className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          
          {selectedLog?.timestamp === log.timestamp && <ApiLogDetail log={log} getStatusColor={getStatusColor} />}
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          아직 요청 기록이 없습니다
        </div>
      )}
    </div>
  );
}

function ApiLogDetail({ log, getStatusColor }: { log: ApiLog; getStatusColor: (status: number) => string }) {
  return (
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
            {log.headers && (
              <div className="mb-2">
                <span className="font-semibold">Headers:</span>
                <div className="mt-2">
                  <JsonEditor
                    value={JSON.stringify(log.headers, null, 2)}
                    readOnly
                    height="100px"
                  />
                </div>
              </div>
            )}
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
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
            <JsonEditor
              value={JSON.stringify(log.response, null, 2)}
              readOnly
              height="200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 