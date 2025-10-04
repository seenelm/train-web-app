import React from "react";

interface ProgramData {
  name: string;
  types: string[];
  weeks: number;
  includesNutrition: boolean;
  phases: any[];
  isPublic: boolean;
}

interface VisibilityStepProps {
  programData: ProgramData;
  updateProgramData: (data: Partial<ProgramData>) => void;
}

const VisibilityStep: React.FC<VisibilityStepProps> = ({
  programData,
  updateProgramData,
}) => {
  const handleVisibilityChange = (isPublic: boolean) => {
    updateProgramData({ isPublic });
  };

  return (
    <div>
      <div className="option-buttons">
        <button
          type="button"
          className={`option-button ${programData.isPublic ? "selected" : ""}`}
          onClick={() => handleVisibilityChange(true)}
        >
          Public
        </button>
        <button
          type="button"
          className={`option-button ${
            !programData.isPublic ? "selected" : ""
          }`}
          onClick={() => handleVisibilityChange(false)}
        >
          Private
        </button>
      </div>

      <div className="form-info" style={{ marginTop: "1rem" }}>
        {programData.isPublic ? (
          <p>
            <strong>Public:</strong> Your program will be visible to all users
            and can be featured in the program library.
          </p>
        ) : (
          <p>
            <strong>Private:</strong> Your program will only be visible to you
            and users you specifically share it with.
          </p>
        )}
      </div>
    </div>
  );
};

export default VisibilityStep;
