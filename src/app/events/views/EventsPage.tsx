import React from 'react';
import EventManager from '../components/ui/EventManager';
import './Events.css';

const Events: React.FC = () => {
  return (
    <div className="events-page">
      <h1>Events</h1>
      <p className="events-description">
        Create and manage your events or discover upcoming events to attend.
      </p>
      <EventManager />
    </div>
  );
};

export default Events;
