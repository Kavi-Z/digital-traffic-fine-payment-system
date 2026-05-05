import { Stamp, FileText, CheckCircle2 } from "lucide-react";

const steps = [
  { label: "Verify Fine", icon: Stamp },
  { label: "Payment Details", icon: FileText },
  { label: "Confirmation", icon: CheckCircle2 },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center max-w-3xl mx-auto px-4 py-6">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const state = i < current ? "done" : i === current ? "active" : "";
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`step-circle ${state}`}>
                <Icon size={26} />
              </div>
              <div className="mt-2 text-xs font-display tracking-widest uppercase text-[var(--gold-primary)]">
                Step {i + 1}
              </div>
              <div className="text-xs text-[var(--cream)]/80">{s.label}</div>
            </div>
            {i < steps.length - 1 && <div className="dotted-line" />}
          </div>
        );
      })}
    </div>
  );
}
