import api from '../../../services/apiClient';
import { 
  Event, 
  EventsResponse, 
  SuccessResponse 
} from '../../../types/api.types';
import { Alert } from '@seenelm/train-core';
/**
 * Service for event management operations
 */
export const eventService = {
  /**
   * Create a new event
   * @param eventData - Event data
   * @returns Promise with the created event
   */
  async createEvent(eventData: {
    title: string;
    description: string;
    location?: string;
    startDate: string;
    endDate: string;
    groupId?: string;
    imagePath?: string;
    tags?: string[];
    alerts?: Alert[];
  }): Promise<Event> {
    try {
      const response = await api.post<Event>('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Get user events
   * @param status - Event status filter
   * @param timeframe - Event timeframe filter
   * @param page - Page number
   * @param limit - Results limit
   * @returns Promise with events response
   */
  async getUserEvents(
    status: 'ATTENDING' | 'INTERESTED' | 'CREATED' | 'ALL' = 'ALL',
    timeframe: 'PAST' | 'UPCOMING' | 'ALL' = 'UPCOMING',
    page: number = 1,
    limit: number = 10
  ): Promise<EventsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('status', status);
      params.append('timeframe', timeframe);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get<EventsResponse>(`/events/user?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user events:', error);
      throw error;
    }
  },

  /**
   * Get event by ID
   * @param eventId - Event ID
   * @returns Promise with event
   */
  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await api.get<Event>(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error;
    }
  },

  /**
   * Update event
   * @param eventId - Event ID
   * @param eventData - Event data to update
   * @returns Promise with success response
   */
  async updateEvent(
    eventId: string,
    eventData: {
      title?: string;
      description?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      isVirtual?: boolean;
      virtualMeetingLink?: string;
      maxParticipants?: number;
      eventPicture?: string;
      tags?: string[];
    }
  ): Promise<SuccessResponse> {
    try {
      const response = await api.put<SuccessResponse>(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Update user event status
   * @param eventId - Event ID
   * @param status - Event status
   * @returns Promise with success response
   */
  async updateUserEventStatus(
    eventId: string,
    status: 'ATTENDING' | 'INTERESTED' | 'NOT_ATTENDING'
  ): Promise<SuccessResponse> {
    try {
      const response = await api.put<SuccessResponse>(`/events/${eventId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user event status:', error);
      throw error;
    }
  },

  /**
   * Delete event
   * @param eventId - Event ID
   * @returns Promise with success response
   */
  async deleteEvent(eventId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  /**
   * Delete user event association
   * @param eventId - Event ID
   * @returns Promise with success response
   */
  async deleteUserEventAssociation(eventId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(`/events/${eventId}/user-event`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user event association:', error);
      throw error;
    }
  },

  /**
   * Remove user from event
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Promise with success response
   */
  async removeUserFromEvent(eventId: string, userId: string): Promise<SuccessResponse> {
    try {
      const response = await api.delete<SuccessResponse>(`/events/${eventId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing user from event:', error);
      throw error;
    }
  }
};

export default eventService;
