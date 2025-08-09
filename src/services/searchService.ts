import api from './apiClient';
import { 
  CertificationsSearchResponse, 
  ProfilesSearchResponse 
} from '../types/api.types';

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
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CertificationsSearchResponse> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<CertificationsSearchResponse>(
        `/search/certifications?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching certifications:', error);
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
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProfilesSearchResponse> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<ProfilesSearchResponse>(
        `/search/profiles?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching profiles and groups:', error);
      throw error;
    }
  }
};

export default searchService;
