import React from "react";
import Button from "../../../components/ui/Button";

interface StepWrapperProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
}

const StepWrapper: React.FC<StepWrapperProps> = ({
  currentStep,
  totalSteps,
  title,
  children,
  onBack,
  onNext,
  isLastStep,
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="program-builder-container">
      {/* Progress bar */}
      <div className="program-builder-progress">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-steps">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      {title && <h1 className="program-builder-title">{title}</h1>}

      {/* Unique form inputs */}
      <div className="program-builder-step">{children}</div>

      {/* Navigation */}
      <div className="program-builder-actions">
        {currentStep > 0 && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={onNext}>
          {isLastStep ? "Finish" : currentStep === 0 ? "Continue" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepWrapper;
