import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";

const ErrorUI = ({ handleRetry }: ErrorUIProps) => {
  const { t } = useTranslation(['common']);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-center text-red-400">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p className="mb-4">{t('common:admin.failedToLoad')}</p>
        <Button onClick={handleRetry} variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('common:admin.retry')}
        </Button>
      </div>
    </div>
  );
};

export default ErrorUI;
interface ErrorUIProps {
  handleRetry: () => void;
}
