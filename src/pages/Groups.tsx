import React from 'react';
import GroupManager from '../components/GroupManager';
import './styles/Groups.css';

const Groups: React.FC = () => {
  return (
    <div className="groups-page">
      <h1>Groups</h1>
      <p className="groups-description">
        Create and manage your groups or join existing ones to connect with others.
      </p>
      <GroupManager />
    </div>
  );
};

export default Groups;
