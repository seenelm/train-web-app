import React, { useState, useEffect, useCallback, useRef } from 'react';
import { eventService } from '../../services/eventService';
import { Event } from '../../../../types/api.types';
import { UserEventResponse, CursorPaginationResponse, EventRequest } from '@seenelm/train-core';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaVideo, 
  FaFilter
} from 'react-icons/fa';
import './EventManager.css';
import { tokenService } from '../../../../services/tokenService';

interface EventManagerProps {
  onEventSelect?: (event: Event) => void;
  groupId?: string; // Optional: filter events by group
}

const EventManager: React.FC<EventManagerProps> = ({ onEventSelect, groupId }) => {
  const [events, setEvents] = useState<UserEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Pagination states
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'ATTENDING' | 'INTERESTED' | 'CREATED' | 'ALL'>('ALL');
  const [timeframeFilter, setTimeframeFilter] = useState<'PAST' | 'UPCOMING' | 'ALL'>('UPCOMING');
  
  // Form state using EventRequest DTO
  const [eventData, setEventData] = useState<EventRequest>({
    title: '',
    admin: [], // Will be set to current user ID when creating
    invitees: [],
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    description: '',
    alerts: [],
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || '');
  
  // Load user's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = tokenService.getUser();
        if (!user) {
          return;
        }
        const userId = JSON.parse(user).userId;
        
        const response = await eventService.getUserEvents(userId, 20);
        
        setEvents(response.data);
        setHasNextPage(response.pagination.hasNextPage);
        setNextCursor(response.pagination.nextCursor);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [statusFilter, timeframeFilter]);

  // Load more events for infinite scrolling
  const loadMoreEvents = useCallback(async () => {
    if (!hasNextPage || loadingMore || !nextCursor) return;
    
    try {
      setLoadingMore(true);
      
      const user = tokenService.getUser();
      if (!user) {
        return;
      }
      const userId = JSON.parse(user).userId;
      
      const response = await eventService.getUserEvents(userId, 20, nextCursor);
      
      setEvents(prev => [...prev, ...response.data]);
      setHasNextPage(response.pagination.hasNextPage);
      setNextCursor(response.pagination.nextCursor);
    } catch (err) {
      console.error('Error loading more events:', err);
      setError('Failed to load more events. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, loadingMore, nextCursor]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Reset form
  const resetForm = () => {
    setEventData({
      title: '',
      admin: [],
      invitees: [],
      startTime: new Date(),
      endTime: new Date(),
      location: '',
      description: '',
      alerts: [],
      tags: []
    });
    setNewTag('');
    setSelectedGroupId(groupId || '');
    setEditingEvent(null);
  };

  // Helper function to safely convert date strings to Date objects
  const safeDateConversion = (dateValue: string | Date): Date => {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    return new Date(dateValue);
  };

  // Initialize form for editing
  const handleEditEvent = (userEvent: UserEventResponse) => {
    const event = userEvent.event;
    setEditingEvent(event as any); // TODO: Convert UserEventResponse to Event type
    
    // Debug: Log the actual types of date fields
    console.log('Event dates:', {
      startTime: event.startTime,
      startTimeType: typeof event.startTime,
      endTime: event.endTime,
      endTimeType: typeof event.endTime
    });
    
    // Update eventData with the event values, ensuring dates are properly converted
    setEventData({
      title: event.title,
      admin: event.admin,
      invitees: event.invitees,
      startTime: safeDateConversion(event.startTime),
      endTime: event.endTime ? safeDateConversion(event.endTime) : safeDateConversion(event.startTime),
      location: event.location || '',
      description: event.description || '',
      alerts: event.alerts || [],
      tags: event.tags || []
    });
    
    setSelectedGroupId(''); // TODO: Get groupId from event if available
    setShowCreateForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      // Get current user ID for admin field
      const user = tokenService.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }
      const userId = JSON.parse(user).userId;
      
      // Prepare event data using EventRequest structure
      const eventRequest: EventRequest = {
        title: eventData.title,
        admin: [userId], // Current user as admin
        invitees: eventData.invitees,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location || undefined,
        description: eventData.description || undefined,
        alerts: eventData.alerts,
        tags: eventData.tags
      };
      
      if (editingEvent) {
        // Update existing event - convert EventRequest to the format expected by updateEvent
        const updateData = {
          title: eventRequest.title,
          description: eventRequest.description || '',
          location: eventRequest.location,
          startDate: eventRequest.startTime.toISOString(),
          endDate: eventRequest.endTime?.toISOString() || eventRequest.startTime.toISOString(),
          tags: eventRequest.tags
        };
        
        await eventService.updateEvent(editingEvent.id, updateData);
        
        // Update local state
        setEvents(events.map(userEvent => 
          userEvent.event.id === editingEvent?.id 
            ? { 
                ...userEvent, 
                event: { 
                  ...userEvent.event, 
                  title: eventRequest.title,
                  description: eventRequest.description || userEvent.event.description,
                  location: eventRequest.location || userEvent.event.location,
                  tags: eventRequest.tags || userEvent.event.tags
                } 
              } 
            : userEvent
        ));
      } else {
        // Create new event using EventRequest
        // Note: We need to update the backend to accept EventRequest directly
        // For now, we'll convert it to the format expected by createEvent
        const createData = {
          title: eventRequest.title,
          description: eventRequest.description || '',
          location: eventRequest.location,
          startDate: eventRequest.startTime.toISOString(),
          endDate: eventRequest.endTime?.toISOString() || eventRequest.startTime.toISOString(),
          groupId: selectedGroupId || undefined,
          imagePath: undefined, // Not supported in EventRequest
          tags: eventRequest.tags,
          alerts: eventRequest.alerts
        };
        
        const newEvent = await eventService.createEvent(createData);
        
        // Log the created event for debugging
        console.log('Created event:', newEvent);
        
        // Update local state - convert Event to UserEventResponse format
        const newUserEvent: UserEventResponse = {
          event: {
            id: newEvent.id,
            title: newEvent.title,
            admin: [userId], // Current user as admin
            invitees: [],
            startTime: new Date(newEvent.startDate), // Convert string to Date
            endTime: new Date(newEvent.endDate),     // Convert string to Date
            location: newEvent.location || '',
            description: newEvent.description || '',
            alerts: [],
            tags: newEvent.tags || []
          },
          status: 2 // EventStatus.Accepted
        };
        setEvents([...events, newUserEvent]);
      }
      
      // Reset form and hide it
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      
      // Delete event
      await eventService.deleteEvent(eventId);
      
      // Update local state
      setEvents(events.filter(event => event.event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !eventData.tags?.includes(newTag.trim())) {
      setEventData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  // Get event status class
  const getEventStatusClass = (userEvent: UserEventResponse) => {
    const event = userEvent.event;
    const now = new Date();
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    if (endDate < now) {
      return 'event-past';
    } else if (startDate <= now && endDate >= now) {
      return 'event-ongoing';
    } else {
      return 'event-upcoming';
    }
  };

  return (
    <div className="event-manager">
      <div className="event-manager-header">
        <h2>
          <FaCalendarAlt /> Events
        </h2>
        <div className="event-manager-actions">
          <div className="event-filters">
            <button 
              className={`filter-button ${timeframeFilter === 'UPCOMING' ? 'active' : ''}`}
              onClick={() => setTimeframeFilter('UPCOMING')}
            >
              Upcoming
            </button>
            <button 
              className={`filter-button ${timeframeFilter === 'PAST' ? 'active' : ''}`}
              onClick={() => setTimeframeFilter('PAST')}
            >
              Past
            </button>
            <button 
              className={`filter-button ${timeframeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setTimeframeFilter('ALL')}
            >
              All
            </button>
            <div className="filter-dropdown">
              <button className="filter-dropdown-button">
                <FaFilter /> {statusFilter === 'ALL' ? 'All Events' : 
                  statusFilter === 'ATTENDING' ? 'Attending' : 
                  statusFilter === 'INTERESTED' ? 'Interested' : 'Created'}
              </button>
              <div className="filter-dropdown-content">
                <button onClick={() => setStatusFilter('ALL')}>All Events</button>
                <button onClick={() => setStatusFilter('ATTENDING')}>Attending</button>
                <button onClick={() => setStatusFilter('INTERESTED')}>Interested</button>
                <button onClick={() => setStatusFilter('CREATED')}>Created by Me</button>
              </div>
            </div>
          </div>
          <button 
            className="create-event-button"
            onClick={() => {
              resetForm();
              setShowCreateForm(!showCreateForm);
            }}
          >
            <FaPlus /> {showCreateForm ? 'Cancel' : 'Create Event'}
          </button>
        </div>
      </div>
      
      {error && <div className="event-manager-error">{error}</div>}
      
      {showCreateForm && (
        <div className="event-form-container">
          <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter event title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={eventData.description || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                placeholder="Describe your event"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={eventData.startTime.toISOString().slice(0, 16)}
                  onChange={(e) => setEventData(prev => ({ 
                    ...prev, 
                    startTime: new Date(e.target.value) 
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={eventData.endTime?.toISOString().slice(0, 16) || eventData.startTime.toISOString().slice(0, 16)}
                  onChange={(e) => setEventData(prev => ({ 
                    ...prev, 
                    endTime: new Date(e.target.value) 
                  }))}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={eventData.location || ''}
                onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter event location"
              />
            </div>
            

            

            
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-container">
                {eventData.tags?.map((tag, index) => (
                  <div key={index} className="tag">
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      aria-label="Remove tag"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button type="button" onClick={handleAddTag}>Add</button>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="events-loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="no-events">
          <p>No events found. {timeframeFilter !== 'ALL' && 'Try changing the filters or '} Create a new event to get started.</p>
          <button 
            className="create-first-event"
            onClick={() => setShowCreateForm(true)}
          >
            <FaPlus /> Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-list">
          {events.map(userEvent => {
            const event = userEvent.event;
            
            // Debug: Log the event data structure
            console.log('Rendering event:', {
              id: event.id,
              title: event.title,
              startTime: event.startTime,
              startTimeType: typeof event.startTime,
              endTime: event.endTime,
              endTimeType: typeof event.endTime
            });
            
            return (
              <div key={event.id} className={`event-card ${getEventStatusClass(userEvent)}`}>
                <div 
                  className="event-card-content"
                  onClick={() => onEventSelect && onEventSelect(event as any)}
                >
                  <div className="event-image">
                    <div className="event-image-placeholder">
                      <FaCalendarAlt />
                    </div>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-dates">
                      <FaClock />
                      <span>{formatDate(new Date(event.startTime).toISOString())}</span>
                      {new Date(event.startTime).toDateString() !== new Date(event.endTime).toDateString() && (
                        <>
                          <span> to </span>
                          <span>{formatDate(new Date(event.endTime).toISOString())}</span>
                        </>
                      )}
                    </div>
                    
                    {event.location && (
                      <div className="event-location">
                        <FaMapMarkerAlt />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    <p className="event-description">{event.description}</p>
                    
                    {event.tags && event.tags.length > 0 && (
                      <div className="event-tags">
                        {event.tags.map((tag, index) => (
                          <span key={index} className="event-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="event-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditEvent(userEvent)}
                    aria-label="Edit event"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteEvent(event.id)}
                    aria-label="Delete event"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Load More Button */}
      {!loading && events.length > 0 && hasNextPage && (
        <div className="load-more-container">
          <button 
            className="load-more-button"
            onClick={loadMoreEvents}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Events'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventManager;
