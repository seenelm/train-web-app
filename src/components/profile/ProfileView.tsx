import React, { useState } from 'react';
import { UserProfileResponse, SocialLinkResponse, CertificationResponse, CustomSectionResponse } from '@seenelm/train-core';
import { ProfileAccess, CustomSectionType, SocialPlatform } from '@seenelm/train-core';
import './styles/profileView.css';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook, 
  FaYoutube, 
  FaGlobe, 
  FaLink,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLock,
  FaUsers,
  FaGlobeAmericas,
  FaDumbbell,
  FaMedal,
  FaCertificate,
  FaPlus
} from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import trainer from '../../assets/trainer.png';
import AddSectionModal from './AddSectionModal';

// Mock data for trainer demonstration
const mockProfile: UserProfileResponse = {
  userId: '123456',
  username: 'fitcoach',
  name: 'Alex Johnson',
  bio: 'Certified personal trainer with 8+ years of experience specializing in strength training, functional fitness, and nutrition coaching. Helping clients achieve their fitness goals through personalized training programs.',
  accountType: ProfileAccess.Public,
  profilePicture: trainer,
  role: 'Senior Fitness Trainer',
  location: 'San Francisco, CA',
  socialLinks: [
    { platform: SocialPlatform.INSTAGRAM, url: 'https://instagram.com/fitcoach' },
    { platform: SocialPlatform.YOUTUBE, url: 'https://youtube.com/fitcoach' },
    { platform: SocialPlatform.LINKEDIN, url: 'https://linkedin.com/in/fitcoach' }
  ],
  certifications: [
    { 
      name: 'NASM Certified Personal Trainer', 
      issuer: 'National Academy of Sports Medicine', 
      imageURL: 'https://www.nasm.org/images/nasmmedia/nasm-logo.svg', 
      certType: 'Professional',
      specializations: ['Personal Training', 'Fitness Assessment'] 
    },
    { 
      name: 'Precision Nutrition Level 2 Coach', 
      issuer: 'Precision Nutrition', 
      imageURL: 'https://www.precisionnutrition.com/wp-content/uploads/2019/10/Precision-Nutrition-Coaching-Certification-Level-2.jpg', 
      certType: 'Professional',
      specializations: ['Nutrition Coaching', 'Behavior Change'] 
    },
    { 
      name: 'TRX Suspension Training Specialist', 
      issuer: 'TRX Training', 
      imageURL: 'https://trxtraining.com/wp-content/uploads/2021/01/TRX_Logo_Black.png', 
      certType: 'Specialization',
      specializations: ['Suspension Training', 'Functional Movement'] 
    }
  ],
  customSections: [
    {
      title: CustomSectionType.SPECIALIZATION,
      details: [
        { area: 'Strength Training', skills: 'Powerlifting, Olympic weightlifting, functional strength' },
        { area: 'Nutrition Coaching', skills: 'Meal planning, macronutrient calculation, dietary strategies' },
        { area: 'Rehabilitation', skills: 'Post-injury recovery, corrective exercise, mobility work' }
      ]
    },
    {
      title: CustomSectionType.PHILOSOPHY,
      details: [
        { philosophy: 'I believe fitness should be accessible to everyone regardless of age or ability level.' },
        { approach: 'My training approach focuses on sustainable habits, proper form, and progressive overload.' }
      ]
    },
    {
      title: CustomSectionType.ACHIEVEMENTS,
      details: [
        { title: 'Trainer of the Year 2023', date: '2023-12-15', description: 'Recognized for outstanding client results and community impact.' },
        { title: 'Featured in Men\'s Health Magazine', date: '2022-06-01', description: 'Expert contributor for special edition on functional fitness.' },
        { title: '100+ Client Transformations', date: '2021-01-15', description: 'Helped over 100 clients achieve significant fitness and health improvements.' }
      ]
    },
    {
      title: CustomSectionType.STATS,
      details: [
        { 
          clientsServed: 250,
          averageRating: 4.9,
          yearsExperience: 8,
          specialtiesCount: 5
        }
      ]
    }
  ]
};

interface ProfileViewProps {
  profile?: UserProfileResponse;
  isEditable?: boolean;
  onEdit?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  profile = mockProfile,
  isEditable = true,
  onEdit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSocialIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.TWITTER:
        return <FaTwitter />;
      case SocialPlatform.LINKEDIN:
        return <FaLinkedin />;
      case SocialPlatform.INSTAGRAM:
        return <FaInstagram />;
      case SocialPlatform.FACEBOOK:
        return <FaFacebook />;
      case SocialPlatform.YOUTUBE:
        return <FaYoutube />;
      case SocialPlatform.WEBSITE:
        return <FaGlobe />;
      default:
        return <FaLink />;
    }
  };

  const getPrivacyIcon = (accountType: ProfileAccess) => {
    switch (accountType) {
      case ProfileAccess.Private:
        return <FaLock title="Private Profile" />;
      case ProfileAccess.Public:
        return <FaGlobeAmericas title="Public Profile" />;
      default:
        return null;
    }
  };

  const renderSocialLinks = (links: SocialLinkResponse[]) => {
    return (
      <div className="social-links">
        {links.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            title={link.platform}
          >
            {getSocialIcon(link.platform)}
          </a>
        ))}
      </div>
    );
  };

  const renderCertifications = (certifications: CertificationResponse[]) => {
    return (
      <div className="certifications-container">
        {certifications.map((cert, index) => (
          <div key={index} className="certification-card">
            <div className="cert-image">
              <img src={cert.imageURL} alt={cert.name} />
            </div>
            <div className="cert-details">
              <h3>{cert.name}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <div className="cert-specializations">
                {cert.specializations.map((spec, i) => (
                  <span key={i} className="specialization-tag">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAchievements = (achievements: any[]) => {
    return (
      <div className="achievements-container">
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement-item">
            <div className="achievement-date">
              {achievement.date && new Date(achievement.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short'
              })}
            </div>
            <div className="achievement-content">
              <h3>{achievement.title}</h3>
              {achievement.description && <p>{achievement.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGenericItems = (items: any[], sectionType: CustomSectionType) => {
    if (sectionType === CustomSectionType.STATS) {
      return renderTrainerStats(items[0]);
    }
    
    return (
      <div className="generic-items-container">
        {items.map((item, index) => (
          <div key={index} className="generic-item">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="generic-item-row">
                <span className="generic-item-key">{key}:</span>
                <span className="generic-item-value">{String(value)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderTrainerStats = (stats: any) => {
    return (
      <div className="trainer-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.clientsServed}+</div>
          <div className="stat-label">Clients Served</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.yearsExperience}+</div>
          <div className="stat-label">Years Experience</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.specialtiesCount}</div>
          <div className="stat-label">Specialties</div>
        </div>
      </div>
    );
  };

  const renderCustomSection = (section: CustomSectionResponse) => {
    switch (section.title) {
      case CustomSectionType.ACHIEVEMENTS:
        return renderAchievements(section.details);
      default:
        return renderGenericItems(section.details, section.title);
    }
  };

  const getSectionIcon = (sectionType: CustomSectionType) => {
    switch (sectionType) {
      case CustomSectionType.SPECIALIZATION:
        return <FaDumbbell className="section-icon" />;
      case CustomSectionType.ACHIEVEMENTS:
        return <FaMedal className="section-icon" />;
      case CustomSectionType.PHILOSOPHY:
        return <FaGlobe className="section-icon" />;
      case CustomSectionType.STATS:
        return <FaUsers className="section-icon" />;
      default:
        return null;
    }
  };

  const formatSectionTitle = (title: string) => {
    return title.charAt(0) + title.slice(1).toLowerCase().replace('_', ' ');
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  }

  const handleAddSection = () => {
    setIsModalOpen(true);
  }

  // Find specific custom sections
  const statsSection = profile.customSections?.find(s => s.title === CustomSectionType.STATS);
  const philosophySection = profile.customSections?.find(s => s.title === CustomSectionType.PHILOSOPHY);
  const achievementsSection = profile.customSections?.find(s => s.title === CustomSectionType.ACHIEVEMENTS);
  const specializationSection = profile.customSections?.find(s => s.title === CustomSectionType.SPECIALIZATION);

  return (
    <div className="profile-container modern">
      <div className="profile-header">
        <div className="profile-cover-photo"></div>
        <div className="profile-header-content">
          <div className="profile-avatar">
            <img 
              src={profile.profilePicture || 'https://via.placeholder.com/150'} 
              alt={profile.name} 
            />
          </div>
          <div className="profile-info">
            <div className="profile-name-container">
              <h1 className="profile-name">{profile.name}</h1>
              <span className="profile-privacy-badge">
                {getPrivacyIcon(profile.accountType)}
              </span>
              {isEditable && (
                <button className="edit-profile-btn" onClick={handleEditProfile}>
                  <AiOutlineEdit /> Edit
                </button>
              )}
            </div>
            <div className="profile-username">@{profile.username}</div>
            {profile.role && (
              <div className="profile-role">
                <FaBriefcase /> {profile.role}
              </div>
            )}
            {profile.location && (
              <div className="profile-location">
                <FaMapMarkerAlt /> {profile.location}
              </div>
            )}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              renderSocialLinks(profile.socialLinks)
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddSectionModal
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="profile-content-unified">
        {/* Bio Section with Add Section button */}
        <div className="profile-section-header">
          <h2 className="section-title">Bio</h2>
          {isEditable && (
            <button className="add-section-btn" onClick={handleAddSection}>
              <FaPlus /> Add Section
            </button>
          )}
        </div>
        
        {profile.bio && (
          <div className="profile-section bio-section">
            <p className="profile-bio">{profile.bio}</p>
          </div>
        )}
        
        {/* Stats Section - Displayed prominently if available */}
        {statsSection && (
          <div className="profile-section stats-section">
            {renderTrainerStats(statsSection.details[0])}
          </div>
        )}
        
        {/* Two-column layout for main content */}
        <div className="profile-main-content">
          <div className="profile-column">
            {/* Specializations */}
            {specializationSection && (
              <div className="profile-section">
                <h2 className="section-title">
                  <FaDumbbell className="section-icon" />
                  Specializations
                </h2>
                {renderCustomSection(specializationSection)}
              </div>
            )}
            
            {/* Philosophy */}
            {philosophySection && (
              <div className="profile-section">
                <h2 className="section-title">
                  <FaGlobe className="section-icon" />
                  Philosophy
                </h2>
                {renderCustomSection(philosophySection)}
              </div>
            )}
          </div>
          
          <div className="profile-column">
            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="profile-section">
                <h2 className="section-title">
                  <FaCertificate className="section-icon" />
                  Certifications
                </h2>
                {renderCertifications(profile.certifications)}
              </div>
            )}
            
            {/* Achievements */}
            {achievementsSection && (
              <div className="profile-section">
                <h2 className="section-title">
                  <FaMedal className="section-icon" />
                  Achievements
                </h2>
                {renderCustomSection(achievementsSection)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
