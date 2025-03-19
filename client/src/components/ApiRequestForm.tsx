interface ApiRequestFormProps {
  method: string;
  url: string;
  onMethodChange: (method: string) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ApiRequestForm({ method, url, onMethodChange, onUrlChange, onSubmit }: ApiRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex">
        <div className="flex">
          <select
            id="method"
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
        </div>
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
    </form>
  );
} 