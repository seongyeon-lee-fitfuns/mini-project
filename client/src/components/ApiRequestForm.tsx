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
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="http://localhost:7350/healthcheck"
            className="flex-grow border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
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