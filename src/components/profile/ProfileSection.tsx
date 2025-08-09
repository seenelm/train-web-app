import React, { ReactNode } from 'react';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`profile-subsection ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export default ProfileSection;
