import { BaseApiService } from "../../../services/BaseApiService";
import {
  ProgramResponse,
  ProgramRequest,
} from "@seenelm/train-core";

/**
 * Service for program management operations
 */
class ProgramService extends BaseApiService<
  ProgramResponse,
  ProgramRequest,
  ProgramRequest
> {
  constructor() {
    super("/program", "program");
  }

  protected getBaseEndpoint(): string {
    return this.baseEndpoint;
  }

  /**
   * Create a new program
   * POST /program
   */
  async createProgram(programData: ProgramRequest): Promise<ProgramResponse> {
    return this.create(programData);
  }

  /**
   * Get all programs
   * GET /program
   */
  async getPrograms(): Promise<ProgramResponse[]> {
    return this.getAll();
  }

  /**
   * Get All User Programs
   * GET /program/user
   */
  async fetchUserPrograms(userId: string): Promise<ProgramResponse[]> {
    return this.get<ProgramResponse[]>(`/program/user/${userId}`);
  }

  /**
   * Get Program Details by ID
   * GET /program/:id
   */
  async fetchProgramDetails(programId: string): Promise<ProgramResponse> {
    return this.getById(programId);
  }
}

// Export singleton instance
export const programService = new ProgramService();
export default programService;
