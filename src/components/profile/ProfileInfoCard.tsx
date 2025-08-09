import React, { ReactNode } from 'react';

interface ProfileInfoCardProps {
  children: ReactNode;
  className?: string;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`profile-section profile-info-card ${className}`}>
      {children}
    </div>
  );
};

export default ProfileInfoCard;
