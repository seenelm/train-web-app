import { BaseApiService } from "../../../services/BaseApiService";
import { SuccessResponse, JoinRequestResponse } from "../../../types/api.types";
import {
  GroupResponse,
  UserGroupsResponse,
  GroupRequest,
} from "@seenelm/train-core";

/**
 * Service for group management operations
 */
class GroupService extends BaseApiService<
  GroupResponse,
  GroupRequest,
  GroupRequest
> {
  constructor() {
    super("/group", "group");
  }

  protected getBaseEndpoint(): string {
    return this.baseEndpoint;
  }

  /**
   * Create a new group
   * POST /group
   */
  async createGroup(groupData: GroupRequest): Promise<GroupResponse> {
    return this.create(groupData);
  }

  /**
   * Fetch user groups
   * GET /user-profile/{userId}/groups
   */
  async fetchUserGroups(userId: string): Promise<UserGroupsResponse> {
    return this.get<UserGroupsResponse>(`/user-profile/${userId}/groups`);
  }

  /**
   * Join a public group
   * PUT /group/{groupId}/join
   */
  async joinPublicGroup(groupId: string): Promise<SuccessResponse> {
    return this.put<SuccessResponse>(`/group/${groupId}/join`);
  }

  /**
   * Request to join a private group
   * PUT /group/{groupId}/request-join
   */
  async requestToJoinPrivateGroup(
    groupId: string
  ): Promise<JoinRequestResponse> {
    return this.put<JoinRequestResponse>(`/group/${groupId}/request-join`);
  }

  /**
   * Accept a join request
   * PUT /group/{groupId}/accept-request/{requesterId}
   */
  async acceptJoinRequest(
    groupId: string,
    requesterId: string
  ): Promise<SuccessResponse> {
    return this.put<SuccessResponse>(
      `/group/${groupId}/accept-request/${requesterId}`
    );
  }

  /**
   * Reject a join request
   * DELETE /group/{groupId}/reject-request/{requesterId}
   */
  async rejectJoinRequest(
    groupId: string,
    requesterId: string
  ): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(
      `/group/${groupId}/reject-request/${requesterId}`
    );
  }

  /**
   * Leave a group
   * DELETE /group/{groupId}/leave
   */
  async leaveGroup(groupId: string): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(`/group/${groupId}/leave`);
  }

  /**
   * Remove a member from a group
   * DELETE /group/{groupId}/members/{memberId}
   */
  async removeMemberFromGroup(
    groupId: string,
    memberId: string
  ): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(
      `/group/${groupId}/members/${memberId}`
    );
  }

  /**
   * Update group profile
   * PUT /group/{groupId}/profile
   */
  async updateGroupProfile(
    groupId: string,
    groupData: GroupRequest
  ): Promise<GroupResponse> {
    return this.put<GroupResponse>(`/group/${groupId}/profile`, groupData);
  }

  /**
   * Delete a group
   * DELETE /group/{groupId}
   */
  async deleteGroup(groupId: string): Promise<SuccessResponse> {
    return this.deleteById(groupId);
  }
}

// Export singleton instance
export const groupService = new GroupService();
export default groupService;
