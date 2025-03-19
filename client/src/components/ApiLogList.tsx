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
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (status >= 400 && status < 500) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    if (status >= 500) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.timestamp}>
          <div 
            className={`flex items-center justify-between p-3 border dark:border-gray-700 rounded 
              hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer 
              ${selectedLog?.timestamp === log.timestamp ? 'bg-gray-50 dark:bg-gray-800' : 'dark:bg-gray-900'}`}
            onClick={() => onLogSelect(selectedLog?.timestamp === log.timestamp ? null : log)}
          >
            <div className="flex items-center space-x-3">
              <span className="uppercase font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm dark:text-gray-200">
                {log.method}
              </span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{log.url}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLogReload(log);
                }}
                className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                다시 요청하기
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogDelete(log.timestamp);
                }}
                className="text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                삭제
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          
          {selectedLog?.timestamp === log.timestamp && (
            <div className="mt-2 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2 dark:text-gray-200">요청 정보</h4>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                    <div className="mb-2 dark:text-gray-300">
                      <span className="font-semibold">Method:</span> {log.method}
                    </div>
                    <div className="mb-2 dark:text-gray-300">
                      <span className="font-semibold">URL:</span> {log.url}
                    </div>
                    {log.headers && (
                      <div className="mb-2">
                        <span className="font-semibold dark:text-gray-300">Headers:</span>
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
                        <span className="font-semibold dark:text-gray-300">Request Body:</span>
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
                  <h4 className="font-bold mb-2 dark:text-gray-200">응답 정보</h4>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                    <div className="mb-2">
                      <span className="font-semibold dark:text-gray-300">Status:</span>{' '}
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
          )}
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          아직 요청 기록이 없습니다
        </div>
      )}
    </div>
  );
} 