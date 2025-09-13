import React from "react";

interface ProgramPhase {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
}

interface ProgramData {
  name: string;
  types: string[];
  weeks: number;
  includesNutrition: boolean;
  phases: ProgramPhase[];
  isPublic: boolean;
}

interface Props {
  programData: ProgramData;
  updateProgramData: (data: Partial<ProgramData>) => void;
}

const ProgramFrequencyStep: React.FC<Props> = ({ programData, updateProgramData }) => {
  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;

    // Update program weeks
    updateProgramData({ weeks: value });

    // Also update the end week of the first phase if it exists
    if (programData.phases.length > 0) {
      const updatedPhases = [...programData.phases];
      updatedPhases[0] = {
        ...updatedPhases[0],
        endWeek: value,
      };

      updateProgramData({
        phases: updatedPhases,
      });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="programWeeks">Number of Weeks</label>
      <input
        type="number"
        id="programWeeks"
        className="form-control"
        value={programData.weeks || ""}
        onChange={handleWeeksChange}
        min="1"
        max="52"
        placeholder="Enter number of weeks"
        autoFocus
      />
      <small className="form-text text-muted">
        How many weeks will this program run for? (1–52 weeks)
      </small>
    </div>
  );
};

export default ProgramFrequencyStep;
