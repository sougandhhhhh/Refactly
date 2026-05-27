import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export function showOldMoneyToast(message: string) {
  toast.custom(
    () => (
      <div className="flex items-center gap-3 border-l-4 border-gold bg-cream-50 px-4 py-3 shadow-old-money">
        <CheckCircle2 size={14} className="text-gold" />
        <span className="font-body text-sm text-charcoal">{message}</span>
      </div>
    ),
    { duration: 2600 },
  );
}
