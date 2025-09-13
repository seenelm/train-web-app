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
   * POST /programs
   */
  async createProgram(programData: ProgramRequest): Promise<ProgramResponse> {
    return this.create(programData);
  }

}

// Export singleton instance
export const programService = new ProgramService();
export default programService;
