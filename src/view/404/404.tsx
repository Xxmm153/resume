import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="text-2xl font-semibold">404 Not Found</div>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-accent transition-colors text-sm font-medium"
      >
        {t("nav.backHome", "Back to Home")}
      </button>
    </div>
  );
};
export default NotFound;
