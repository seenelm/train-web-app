import React, { useState, useEffect } from 'react';
import { groupService } from '../services/groupService';
import { Group } from '../../../types/api.types';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaLock, FaLockOpen } from 'react-icons/fa';
import './GroupManager.css';
import { CreateGroupRequest, UserGroupsResponse } from '@seenelm/train-core';

interface GroupManagerProps {
  onGroupSelect?: (group: Group) => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ onGroupSelect }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  
  const [groupData, setGroupData] = useState<CreateGroupRequest>();
    
  
  // Load user's groups
  useEffect(() => {
      groupService.fetchUserGroups()
      .then((groupData) => {
        setGroups(groupData.groups);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user groups:', error);
        setError('Failed to load user groups. Please try again.');
        setLoading(false);
      });
  }, []);

  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setIsPrivate(false);
    setLocation('');
    setGroupPicture('');
    setTags([]);
    setNewTag('');
    setEditingGroup(null);
  };

  // Initialize form for editing
  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setName(group.name);
    setDescription(group.description);
    setIsPrivate(group.isPrivate);
    setLocation(group.location || '');
    setGroupPicture(group.groupPicture || '');
    setTags(group.tags || []);
    setShowCreateForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      

      
      if (editingGroup) {
        // Update existing group
        await groupService.updateGroupProfile(editingGroup.id, groupData);
        
        // Update local state
        setGroups(groups.map(group => 
          group.id === editingGroup.id 
            ? { ...group, ...groupData, updatedAt: new Date().toISOString() } 
            : group
        ));
      } else {
        // Create new group
        const newGroup = await groupService.createGroup(CreateGroupRequest);
        
        // Update local state
        setGroups([...groups, newGroup]);
      }
      
      // Reset form and hide it
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error saving group:', err);
      setError('Failed to save group. Please try again.');
    }
  };

  // Handle group deletion
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      
      // Delete group
      await groupService.deleteGroup(groupId);
      
      // Update local state
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group. Please try again.');
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="group-manager">
      <div className="group-manager-header">
        <h2>
          <FaUsers /> Your Groups
        </h2>
        <button 
          className="create-group-button"
          onClick={() => {
            resetForm();
            setShowCreateForm(!showCreateForm);
          }}
        >
          <FaPlus /> {showCreateForm ? 'Cancel' : 'Create Group'}
        </button>
      </div>
      
      {error && <div className="group-manager-error">{error}</div>}
      
      {showCreateForm && (
        <div className="group-form-container">
          <h3>{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
          <form onSubmit={handleSubmit} className="group-form">
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter group name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe your group"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location (Optional)</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where is your group based?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="groupPicture">Group Picture URL (Optional)</label>
              <input
                type="text"
                id="groupPicture"
                value={groupPicture}
                onChange={(e) => setGroupPicture(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <label htmlFor="isPrivate">
                {isPrivate ? <FaLock /> : <FaLockOpen />}
                {isPrivate ? 'Private Group' : 'Public Group'}
              </label>
            </div>
            
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div key={index} className="tag">
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      aria-label="Remove tag"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button type="button" onClick={handleAddTag}>Add</button>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {editingGroup ? 'Update Group' : 'Create Group'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="groups-loading">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="no-groups">
          <p>You haven't created or joined any groups yet.</p>
          <button 
            className="create-first-group"
            onClick={() => setShowCreateForm(true)}
          >
            <FaPlus /> Create Your First Group
          </button>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map(group => (
            <div key={group.id} className="group-card">
              <div 
                className="group-card-content"
                onClick={() => onGroupSelect && onGroupSelect(group)}
              >
                <div className="group-image">
                  {group.groupPicture ? (
                    <img src={group.groupPicture} alt={group.name} />
                  ) : (
                    <div className="group-image-placeholder">
                      <FaUsers />
                    </div>
                  )}
                </div>
                <div className="group-info">
                  <h3 className="group-name">
                    {group.name}
                    {group.isPrivate && <span className="private-badge"><FaLock /></span>}
                  </h3>
                  <p className="group-description">{group.description}</p>
                  {group.location && <p className="group-location">{group.location}</p>}
                  <div className="group-meta">
                    <span className="member-count">{group.memberCount} members</span>
                  </div>
                  {group.tags && group.tags.length > 0 && (
                    <div className="group-tags">
                      {group.tags.map((tag, index) => (
                        <span key={index} className="group-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="group-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEditGroup(group)}
                  aria-label="Edit group"
                >
                  <FaEdit />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteGroup(group.id)}
                  aria-label="Delete group"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupManager;
