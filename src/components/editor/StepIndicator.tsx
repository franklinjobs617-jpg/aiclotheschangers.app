"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  stepLabels: { title: string; desc: string }[];
}

export function StepIndicator({ currentStep, stepLabels }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {stepLabels.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const cls = isActive ? "active" : isCompleted ? "completed" : "";

        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div className={`step-item ${cls}`}>
              <div className="step-circle">
                {isCompleted ? <Check size={16} /> : step}
              </div>
              <div className="step-label">
                <strong>{label.title}</strong>
                <span>{label.desc}</span>
              </div>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`step-line ${isCompleted ? "completed" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
