import React from 'react';

export interface Event {
  date: string;
  name: string;
  type: string;
}

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <div className="events-list">
      {events.map((event, index) => (
        <div className="event-item" key={index}>
          <div className="event-date">{event.date}</div>
          <div className="event-details">
            <div className="event-name">{event.name}</div>
            <div className="event-type">{event.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
