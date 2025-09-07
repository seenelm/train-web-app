import React, { useState } from 'react';
// import { eventService } from '../../services/eventService';
import { eventService } from '../../services/EventService2';
import { authService } from '../../../access/services/authService';
import { EventRequest } from '@seenelm/train-core';
import '../../components/ui/EventManager.css';

export default function CreateEventForm({ onCreated }: { onCreated?: (e: any) => void }) {
  const [ev, setEv] = useState<EventRequest>({} as EventRequest);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [showForm, setShowForm] = useState(false);
  const user = authService.getCurrentUser();

  const handleChange = (field: keyof EventRequest, value: string) => {
    if (field === 'startTime' || field === 'endTime') {
      setEv(prev => ({ ...prev, [field]: new Date(value) }));
    } else {
      setEv(prev => ({ ...prev, [field]: value } as EventRequest));
    }
  };
  

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);

    try {
      const payload: EventRequest = {
        ...ev,
        startTime: ev.startTime,
        endTime: ev.endTime || ev.startTime,
        admin: [user?.userId],
      };

      const created = await eventService.createEvent(payload);
      onCreated?.(created);
      setEv({} as EventRequest);
      setShowForm(false);
    } catch {
      setErr('Could not save event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-form-container">
      {!showForm ? (
        <button 
          className="create-event-button" 
          onClick={() => setShowForm(true)}
        >
          + Create New Event
        </button>
      ) : (
        <>
          <h3>Create New Event</h3>
          {err && <div className="form-error">{err}</div>}
          
          <form onSubmit={submit} className="event-form">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter event title"
                value={ev.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter event description"
                value={ev.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="datetime-local"
                  value={ev.startTime ? ev.startTime.toISOString().slice(0,16) : ''}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="datetime-local"
                  value={ev.endTime ? ev.endTime.toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter event location"
                value={ev.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Create Event'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
