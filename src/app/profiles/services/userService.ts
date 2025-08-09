import api from '../../../services/apiClient';
import { tokenService } from '../../../services/tokenService';
import { UserProfile } from '../../../types/api.types';

// Re-export the UserProfile type for backward compatibility
export type { UserProfile };

/**
 * Service for user profile related operations
 */
export const userService = {
  /**
   * Fetches user profile information from the API
   * @param userId - The ID of the user to fetch profile for
   * @returns Promise with the user profile data
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(`/user-profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Gets the current user's profile
   * @returns Promise with the current user's profile data
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    const userString = tokenService.getUser();
    if (!userString) {
      throw new Error('No authenticated user found');
    }
    
    try {
      const currentUser = JSON.parse(userString);
      if (!currentUser.userId) {
        throw new Error('User ID not found in stored user data');
      }
      return this.getUserProfile(currentUser.userId);
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Invalid user data format');
    }
  }
};

export default userService;
