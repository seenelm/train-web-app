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

const PhasesStep: React.FC<Props> = ({ programData, updateProgramData }) => {
  const handlePhaseChange = (
    index: number,
    field: keyof ProgramPhase,
    value: string | number
  ) => {
    const updatedPhases = [...programData.phases];
    updatedPhases[index] = {
      ...updatedPhases[index],
      [field]: value,
    };
    updateProgramData({ phases: updatedPhases });
  };

  const addPhase = () => {
    const lastPhase = programData.phases[programData.phases.length - 1];
    const newStartWeek = lastPhase ? lastPhase.endWeek + 1 : 1;
    const newEndWeek = Math.min(newStartWeek + 3, programData.weeks);

    const newPhase: ProgramPhase = {
      id: Date.now().toString(),
      name: `Phase ${programData.phases.length + 1}`,
      startWeek: newStartWeek,
      endWeek: newEndWeek,
    };

    updateProgramData({ phases: [...programData.phases, newPhase] });
  };

  const removePhase = (phaseId: string) => {
    if (programData.phases.length <= 1) return; // Don't remove the last phase
    updateProgramData({
      phases: programData.phases.filter((phase) => phase.id !== phaseId),
    });
  };

  return (
    <div>
      <p className="form-info">
        Divide your program into phases to organize different training focuses.
      </p>

      {programData.phases.map((phase, index) => (
        <div key={phase.id} className="phase-container">
          <div className="form-group">
            <label htmlFor={`phaseName-${index}`}>Phase Name</label>
            <input
              type="text"
              id={`phaseName-${index}`}
              className="form-control"
              value={phase.name}
              onChange={(e) => handlePhaseChange(index, "name", e.target.value)}
              placeholder="e.g., Foundation, Strength, Power"
            />
          </div>

          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor={`startWeek-${index}`}>Start Week</label>
              <input
                type="number"
                id={`startWeek-${index}`}
                className="form-control"
                value={phase.startWeek}
                onChange={(e) =>
                  handlePhaseChange(
                    index,
                    "startWeek",
                    parseInt(e.target.value) || 1
                  )
                }
                min={1}
                max={programData.weeks}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor={`endWeek-${index}`}>End Week</label>
              <input
                type="number"
                id={`endWeek-${index}`}
                className="form-control"
                value={phase.endWeek}
                onChange={(e) =>
                  handlePhaseChange(
                    index,
                    "endWeek",
                    parseInt(e.target.value) || phase.startWeek
                  )
                }
                min={phase.startWeek}
                max={programData.weeks}
              />
            </div>
          </div>

          {programData.phases.length > 1 && (
            <button
              type="button"
              className="remove-phase-button"
              onClick={() => removePhase(phase.id)}
              style={{
                background: "none",
                border: "none",
                color: "#d32f2f",
                cursor: "pointer",
                padding: "0.5rem 0",
                textAlign: "right",
                width: "100%",
              }}
            >
              Remove Phase
            </button>
          )}
        </div>
      ))}

      {programData.phases[programData.phases.length - 1]?.endWeek <
        programData.weeks && (
        <button
          type="button"
          className="add-phase-button"
          onClick={addPhase}
        >
          + Add Another Phase
        </button>
      )}
    </div>
  );
};

export default PhasesStep;
