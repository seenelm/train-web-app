import api from './apiClient';
import { 
  AuthResponse, 
  SuccessResponse, 
  RefreshTokenResponse 
} from '../types/api.types';

/**
 * Service for user management operations
 */
export const userManagementService = {
  /**
   * Register a new user
   * @param email - User's email
   * @param password - User's password
   * @param name - User's name
   * @returns Promise with the authentication response
   */
  async registerUser(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/user/register', {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Login a user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with the authentication response
   */
  async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/user/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  /**
   * Authenticate with Google
   * @param idToken - Google ID token
   * @returns Promise with the authentication response
   */
  async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/user/google-auth', {
        idToken
      });
      return response.data;
    } catch (error) {
      console.error('Error authenticating with Google:', error);
      throw error;
    }
  },

  /**
   * Request a password reset
   * @param email - User's email
   * @returns Promise with the success response
   */
  async requestPasswordReset(email: string): Promise<SuccessResponse> {
    try {
      const response = await api.post<SuccessResponse>('/user/request-password-reset', {
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  /**
   * Reset password with code
   * @param email - User's email
   * @param resetCode - Reset code
   * @param newPassword - New password
   * @returns Promise with the success response
   */
  async resetPasswordWithCode(
    email: string, 
    resetCode: string, 
    newPassword: string
  ): Promise<SuccessResponse> {
    try {
      const response = await api.post<SuccessResponse>('/user/reset-password-with-code', {
        email,
        resetCode,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  /**
   * Refresh tokens
   * @param refreshToken - Refresh token
   * @returns Promise with the refresh token response
   */
  async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>('/user/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @param refreshToken - Refresh token
   * @returns Promise with the success response
   */
  async logoutUser(refreshToken: string): Promise<SuccessResponse> {
    try {
      const response = await api.post<SuccessResponse>('/user/logout', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }
};

export default userManagementService;
