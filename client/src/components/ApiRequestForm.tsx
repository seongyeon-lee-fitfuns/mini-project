import JsonEditor from "./JsonEditor";

interface ApiRequestFormProps {
  method: string;
  url: string;
  headers: string;
  onMethodChange: (method: string) => void;
  onUrlChange: (url: string) => void;
  onHeadersChange: (headers: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ApiRequestForm({ 
  method, 
  url, 
  headers,
  onMethodChange, 
  onUrlChange,
  onHeadersChange,
  onSubmit 
}: ApiRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className="form-select rounded-l border border-gray-300 dark:border-gray-600 
              py-2 px-3 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-blue-500 dark:focus:border-blue-400
              uppercase"
          >
            <option disabled value="" className="dark:bg-gray-800 dark:text-gray-300">메소드 선택</option>
            <option disabled className="text-muted dark:bg-gray-800 dark:text-gray-500">----</option>
            {["get", "post", "put", "delete"].map((status) => (
              <option 
                key={status} 
                value={status}
                className="dark:bg-gray-800 dark:text-gray-300"
              >
                {status}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="http://localhost:7350/healthcheck"
            className="flex-grow border border-gray-300 dark:border-gray-600 
              px-3 py-2 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:border-blue-500 dark:focus:border-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
              text-white px-4 py-2 rounded-r
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              focus:ring-opacity-50"
          >
            요청 보내기
          </button>
        </div>
        <div>
          <JsonEditor
            value={headers}
            onChange={onHeadersChange}
            height="100px"
            placeholder="헤더 (JSON 형식)"
          />
        </div>
      </div>
    </form>
  );
} 