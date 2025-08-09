import React, { useState, useEffect } from 'react';
import { userService, UserProfile } from '../services/userService';

interface UserProfileByIdProps {
  userId: string;
}

const UserProfileById: React.FC<UserProfileByIdProps> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userProfile = await userService.getUserProfile(userId);
        setProfile(userProfile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="not-found">User profile not found</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <img 
          src={profile.profilePicture || "https://via.placeholder.com/150"} 
          alt={`${profile.name}'s profile`} 
          className="profile-image"
        />
        <h1>{profile.name}</h1>
        <p className="username">@{profile.username}</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          <p>{profile.bio || "No bio available"}</p>
        </div>

        {profile.customSections && profile.customSections.length > 0 && (
          <div className="profile-section">
            <h2>Custom Sections</h2>
            {profile.customSections.map((section, index) => (
              <div key={index} className="custom-section">
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {profile.certifications && profile.certifications.length > 0 && (
          <div className="profile-section">
            <h2>Certifications</h2>
            <ul>
              {profile.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="profile-section">
            <h2>Social Links</h2>
            <ul>
              {profile.socialLinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileById;
