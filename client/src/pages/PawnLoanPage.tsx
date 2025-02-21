import PawnLoanForm from "@/components/loans/PawnLoanForm";
import { useTranslation } from "react-i18next";

export default function PawnLoanPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("loans.pawn.new")}</h1>
      </div>
      <div className="max-w-[800px] mx-auto bg-white rounded-lg shadow-lg p-8">
        <PawnLoanForm />
      </div>
    </div>
  );
}
