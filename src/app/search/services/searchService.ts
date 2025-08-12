import api from "../../../services/apiClient";
import {
  PaginationResponse,
  CertificationResponse,
  SearchProfilesResponse,
} from "@seenelm/train-core";

/**
 * Service for search operations
 */
export const searchService = {
  /**
   * Search certifications
   * @param query - Search query
   * @param page - Page number
   * @param limit - Results limit
   * @returns Promise with certifications search response
   */
  async searchCertifications(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResponse<CertificationResponse>> {
    try {
      const params = new URLSearchParams();
      params.append("searchTerm", searchTerm);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await api.get<PaginationResponse<CertificationResponse>>(
        `/search/certifications?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching certifications:", error);
      throw error;
    }
  },

  /**
   * Search profiles and groups
   * @param query - Search query
   * @param page - Page number
   * @param limit - Results limit
   * @returns Promise with profiles search response
   */
  async searchProfilesAndGroups(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResponse<SearchProfilesResponse>> {
    try {
      const params = new URLSearchParams();
      params.append("searchTerm", searchTerm);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await api.get<
        PaginationResponse<SearchProfilesResponse>
      >(`/search/profiles?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error searching profiles and groups:", error);
      throw error;
    }
  },
};

export default searchService;
