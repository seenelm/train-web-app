import React from 'react';
import UserProfileManager from '../components/UserProfileManager';

const ProfileManagerPage: React.FC = () => {
  return (
    <div className="profile-manager-page">
      <div className="container">
        <UserProfileManager />
      </div>
    </div>
  );
};

export default ProfileManagerPage;
