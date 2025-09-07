import { useState, useEffect } from 'react';
import eventService from '../../services/EventService2';
import { EventResponse } from '@seenelm/train-core';
import CreateEventForm from '../forms/CreateEventForm';
import EventCard from './EventCard';
import { authService } from '../../../access/services/authService';

export default function EventManager() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const events = await eventService.getEvents(user?.userId);
        setEvents(events);
      } catch {
        setErr('Could not load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = (event: EventResponse) => {
    setEvents(prev => [...prev, event]);
  };

  return (
    <div className="event-manager">
      <h2>Events</h2>
      {loading && <p>Loading…</p>}
      {err && <p className="error">{err}</p>}
      <CreateEventForm onCreated={handleCreateEvent} />
      <div className="events-list">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
