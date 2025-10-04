import React from "react";

interface ProgramData {
  name: string;
  types: string[];
  weeks: number;
  includesNutrition: boolean;
  phases: any[];
  isPublic: boolean;
}

interface NutritionStepProps {
  programData: ProgramData;
  updateProgramData: (data: Partial<ProgramData>) => void;
}

const NutritionStep: React.FC<NutritionStepProps> = ({
  programData,
  updateProgramData,
}) => {
  const handleNutritionChange = (includesNutrition: boolean) => {
    updateProgramData({ includesNutrition });
  };

  return (
    <div>
      <div className="option-buttons">
        <button
          type="button"
          className={`option-button ${
            programData.includesNutrition ? "selected" : ""
          }`}
          onClick={() => handleNutritionChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={`option-button ${
            !programData.includesNutrition ? "selected" : ""
          }`}
          onClick={() => handleNutritionChange(false)}
        >
          No
        </button>
      </div>

      <div className="form-info" style={{ marginTop: "1rem" }}>
        {programData.includesNutrition ? (
          <p>Great! Your program will include nutrition guidance.</p>
        ) : (
          <p>
            Your program will focus on workouts only, without nutrition
            guidance.
          </p>
        )}
      </div>
    </div>
  );
};

export default NutritionStep;
