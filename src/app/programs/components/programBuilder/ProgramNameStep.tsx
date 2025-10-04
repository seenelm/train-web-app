import React from "react";

interface ProgramData {
  name: string;
  types: string[];
  weeks: number;
  includesNutrition: boolean;
  phases: any[];
  isPublic: boolean;
}

interface Props {
  programData: ProgramData;
  updateProgramData: (data: Partial<ProgramData>) => void;
}

const ProgramNameStep: React.FC<Props> = ({ programData, updateProgramData }) => {
  const suggestedTypes = ["Strength", "Cardio", "Flexibility", "Swimming", "Running"];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProgramData({ name: e.target.value });
  };

  const toggleType = (type: string) => {
    const selected = programData.types.includes(type);
    updateProgramData({
      types: selected
        ? programData.types.filter((t) => t !== type)
        : [...programData.types, type],
    });
  };

  return (
    <div className="program-name-step">
      <h2>Let's get started</h2>
      <div className="form-group">
        <label htmlFor="programName">Name</label>
        <input
          id="programName"
          className="form-control"
          value={programData.name}
          onChange={handleNameChange}
          placeholder="Workout program"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <div className="type-tags-container">
          {suggestedTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`type-tag ${
                programData.types.includes(type) ? "selected" : ""
              }`}
              onClick={() => toggleType(type)}
            >
              {type}
              {programData.types.includes(type) && (
                <span className="type-tag-remove">×</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramNameStep;
