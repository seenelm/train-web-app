import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { Event } from '../../../../types/api.types';
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

interface EventManagerProps {
  onEventSelect?: (event: Event) => void;
  groupId?: string; // Optional: filter events by group
}

const EventManager: React.FC<EventManagerProps> = ({ onEventSelect, groupId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'ATTENDING' | 'INTERESTED' | 'CREATED' | 'ALL'>('ALL');
  const [timeframeFilter, setTimeframeFilter] = useState<'PAST' | 'UPCOMING' | 'ALL'>('UPCOMING');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualMeetingLink, setVirtualMeetingLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [eventPicture, setEventPicture] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || '');
  
  // Load user's events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await eventService.getUserEvents(
          statusFilter,
          timeframeFilter,
          1, // page
          50 // limit
        );
        
        setEvents(response.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [statusFilter, timeframeFilter]);

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
    setTitle('');
    setDescription('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setIsVirtual(false);
    setVirtualMeetingLink('');
    setMaxParticipants('');
    setEventPicture('');
    setTags([]);
    setNewTag('');
    setSelectedGroupId(groupId || '');
    setEditingEvent(null);
  };

  // Initialize form for editing
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location || '');
    
    // Format dates for datetime-local input
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };
    
    setStartDate(formatDateForInput(event.startDate));
    setEndDate(formatDateForInput(event.endDate));
    
    setIsVirtual(event.isVirtual);
    setVirtualMeetingLink(event.virtualMeetingLink || '');
    setMaxParticipants(event.maxParticipants || '');
    setEventPicture(event.eventPicture || '');
    setTags(event.tags || []);
    setSelectedGroupId(event.groupId || '');
    
    setShowCreateForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      const eventData = {
        title,
        description,
        location: location || undefined,
        startDate,
        endDate,
        isVirtual,
        virtualMeetingLink: isVirtual ? virtualMeetingLink : undefined,
        maxParticipants: maxParticipants !== '' ? Number(maxParticipants) : undefined,
        groupId: selectedGroupId || undefined,
        eventPicture: eventPicture || undefined,
        tags: tags.length > 0 ? tags : undefined
      };
      
      if (editingEvent) {
        // Update existing event
        await eventService.updateEvent(editingEvent.id, eventData);
        
        // Update local state
        setEvents(events.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...eventData } 
            : event
        ));
      } else {
        // Create new event
        const newEvent = await eventService.createEvent(eventData);
        
        // Update local state
        setEvents([...events, newEvent]);
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
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Get event status class
  const getEventStatusClass = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter event title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isVirtual"
                checked={isVirtual}
                onChange={(e) => setIsVirtual(e.target.checked)}
              />
              <label htmlFor="isVirtual">
                <FaVideo /> Virtual Event
              </label>
            </div>
            
            {isVirtual ? (
              <div className="form-group">
                <label htmlFor="virtualMeetingLink">Meeting Link</label>
                <input
                  type="text"
                  id="virtualMeetingLink"
                  value={virtualMeetingLink}
                  onChange={(e) => setVirtualMeetingLink(e.target.value)}
                  placeholder="Enter meeting URL"
                  required={isVirtual}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="maxParticipants">Maximum Participants (Optional)</label>
              <input
                type="number"
                id="maxParticipants"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : '')}
                min="1"
                placeholder="Leave blank for unlimited"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="eventPicture">Event Image URL (Optional)</label>
              <input
                type="text"
                id="eventPicture"
                value={eventPicture}
                onChange={(e) => setEventPicture(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-container">
                {tags.map((tag, index) => (
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
          {events.map(event => (
            <div key={event.id} className={`event-card ${getEventStatusClass(event)}`}>
              <div 
                className="event-card-content"
                onClick={() => onEventSelect && onEventSelect(event)}
              >
                <div className="event-image">
                  {event.eventPicture ? (
                    <img src={event.eventPicture} alt={event.title} />
                  ) : (
                    <div className="event-image-placeholder">
                      <FaCalendarAlt />
                    </div>
                  )}
                </div>
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-dates">
                    <FaClock />
                    <span>{formatDate(event.startDate)}</span>
                    {new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && (
                      <>
                        <span> to </span>
                        <span>{formatDate(event.endDate)}</span>
                      </>
                    )}
                  </div>
                  
                  {event.location && (
                    <div className="event-location">
                      <FaMapMarkerAlt />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  {event.isVirtual && (
                    <div className="event-virtual">
                      <FaVideo />
                      <span>Virtual Event</span>
                    </div>
                  )}
                  
                  {event.maxParticipants && (
                    <div className="event-participants">
                      <FaUsers />
                      <span>Max {event.maxParticipants} participants</span>
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
                  onClick={() => handleEditEvent(event)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManager;
