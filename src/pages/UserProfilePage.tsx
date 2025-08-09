import React, { useState } from 'react';
import UserProfileById from '../components/UserProfileById';

const UserProfilePage: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchId(userId);
  };

  return (
    <div className="user-profile-page">
      <h1>User Profile Lookup</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="userId">Enter User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g., 68977a13c92b70eba5e38cbf"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Look Up Profile
        </button>
      </form>

      {searchId && (
        <div className="profile-container">
          <h2>Profile Results</h2>
          <UserProfileById userId={searchId} />
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
