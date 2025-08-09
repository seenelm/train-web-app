import api from './apiClient';
import { 
  Group, 
  SuccessResponse, 
  JoinRequestResponse 
} from '../types/api.types';

/**
 * Service for group management operations
 */
export const groupService = {
  /**
   * Create a new group
   * @param groupData - Group data
   * @returns Promise with the created group
   */
  async createGroup(groupData: {
    name: string;
    description: string;
    isPrivate: boolean;
    location?: string;
    groupPicture?: string;
    tags?: string[];
  }): Promise<Group> {
    try {
      const response = await api.post<Group>('/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Join a public group
   * @param groupId - Group ID
   * @returns Promise with success response
   */
  async joinPublicGroup(groupId: string): Promise<SuccessResponse> {
    try {
      const response = await api.post<SuccessResponse>(`/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining public group:', error);
      throw error;
    }
  },

  /**
   * Request to join a private group
   * @param groupId - Group ID
   * @returns Promise with join request response
   */
  async requestToJoinPrivateGroup(groupId: string): Promise<JoinRequestResponse> {
    try {
      const response = await api.post<JoinRequestResponse>(`/groups/${groupId}/request`);
      return response.data;
    } catch (error) {
      console.error('Error requesting to join private group:', error);
      throw error;
    }
  },

  /**
   * Accept a join request
   * @param groupId - Group ID
   * @param requestId - Request ID
   * @returns Promise with success response
   */
  async acceptJoinRequest(groupId: string, requestId: string): Promise<SuccessResponse> {
    try {
      const response = await api.put<SuccessResponse>(
        `/groups/${groupId}/requests/${requestId}/accept`
      );
      return response.data;
    } catch (error) {
      console.error('Error accepting join request:', error);
      throw error;
    }
  },

  /**
   * Reject a join request
   * @param groupId - Group ID
   * @param requestId - Request ID
   * @returns Promise with success response
   */
  async rejectJoinRequest(groupId: string, requestId: string): Promise<SuccessResponse> {
    try {
      const response = await api.put<SuccessResponse>(
        `/groups/${groupId}/requests/${requestId}/reject`
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting join request:', error);
      throw error;
    }
  },

  /**
   * Leave a group
   * @param groupId - Group ID
   * @returns Promise with success response
   */
  async leaveGroup(groupId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  /**
   * Remove a member from a group
   * @param groupId - Group ID
   * @param userId - User ID
   * @returns Promise with success response
   */
  async removeMember(groupId: string, userId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(
        `/groups/${groupId}/members/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  /**
   * Update group profile
   * @param groupId - Group ID
   * @param groupData - Group data to update
   * @returns Promise with success response
   */
  async updateGroupProfile(
    groupId: string,
    groupData: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
      location?: string;
      groupPicture?: string;
      tags?: string[];
    }
  ): Promise<SuccessResponse> {
    try {
      const response = await api.put<SuccessResponse>(`/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error updating group profile:', error);
      throw error;
    }
  },

  /**
   * Delete a group
   * @param groupId - Group ID
   * @returns Promise with success response
   */
  async deleteGroup(groupId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }
};

export default groupService;
