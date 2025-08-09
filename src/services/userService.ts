import api from './apiClient';
import { tokenService } from './tokenService';

// Define the user profile interface based on the provided structure
export interface UserProfile {
  _id: string;
  userId: string;
  username: string;
  name: string;
  accountType: number;
  socialLinks: any[];
  certifications: any[];
  customSections?: {
    id?: string;
    title: string;
    content: string;
  }[];
  bio: string;
  profilePicture: string;
  role?: string;
  location?: string;
  tags?: string[];
  isPrivate?: boolean;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

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
