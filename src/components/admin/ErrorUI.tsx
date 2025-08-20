import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

const ErrorUI = ({ handleRetry }: ErrorUIProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-center text-red-400">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p className="mb-4">Failed to load admin data</p>
        <Button onClick={handleRetry} variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorUI;
interface ErrorUIProps {
  handleRetry: () => void;
}
