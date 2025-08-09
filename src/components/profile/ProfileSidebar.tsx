import React from 'react';
import { AiOutlineEnvironment, AiOutlineArrowRight } from 'react-icons/ai';
import Button from '../ui/Button';
import EventsList, { Event } from './EventsList';
import TeamInfo from './TeamInfo';

interface ProfileSidebarProps {
  events: Event[];
  team: string;
  coach: string;
  location: string;
  email: string;
  onRequestPlanClick?: () => void;
  onScheduleSessionClick?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  events,
  team,
  coach,
  location,
  email,
  onRequestPlanClick,
  onScheduleSessionClick
}) => {
  return (
    <div className="profile-sidebar">
      <div className="sidebar-section sidebar-info-card">
        <div className="sidebar-subsection">
          <h3>Upcoming Events</h3>
          <EventsList events={events} />
        </div>

        <div className="sidebar-subsection">
          <h3>Team & Coach</h3>
          <TeamInfo team={team} coach={coach} />
        </div>

        <div className="sidebar-subsection">
          <h3>Location</h3>
          <p className="location">
            <AiOutlineEnvironment /> {location}
          </p>
        </div>

        <div className="sidebar-subsection">
          <h3>Contact</h3>
          <a href={`mailto:${email}`} className="profile-link">
            {email} <AiOutlineArrowRight size={12} />
          </a>
        </div>
      </div>

      <div className="sidebar-actions">
        <Button 
          className="btn-secondary full-width" 
          onClick={onRequestPlanClick}
        >
          Request Training Plan
        </Button>
        <Button 
          className="btn-primary full-width" 
          onClick={onScheduleSessionClick}
        >
          Schedule Session
        </Button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
