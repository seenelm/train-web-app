import {
  ProfileAccess,
  CustomSectionType,
  SocialPlatform,
} from "../enums";

/**
 * Basic user profile info request DTO
 */
export interface BasicUserProfileInfoRequest {
  username: string;
  name: string;
  bio?: string;
  accountType: ProfileAccess;
  profilePicture?: string;
  role?: string;
  location?: string;
}

/**
 * Certification request DTO
 */
export interface CertificationRequest {
  certification: string;
  specializations: string[];
}

// Base interfaces for different types of custom section details
export interface AchievementItem {
  title: string;
  date?: string;
  description?: string;
}
export interface GenericItem {
  [key: string]: string | number | boolean | null;
}
// Type for custom section details based on section type
export type CustomSectionDetails = {
  [CustomSectionType.ACHIEVEMENTS]: AchievementItem[];
  [CustomSectionType.IDENTITY]: GenericItem[];
  [CustomSectionType.SPECIALIZATION]: GenericItem[];
  [CustomSectionType.PHILOSOPHY]: GenericItem[];
  [CustomSectionType.GOALS]: GenericItem[];
  [CustomSectionType.STATS]: GenericItem[];
};

export interface CustomSectionRequest<
  T extends CustomSectionType = CustomSectionType
> {
  title: T;
  details: CustomSectionDetails[T];
}

export interface SocialLinkRequest {
  platform: SocialPlatform;
  url: string;
}

export interface UserProfileRequest {
  userId: string;
  username: string;
  name: string;
  bio?: string;
  accountType: ProfileAccess;
  profilePicture?: string;
  role?: string;
  location?: string;
  socialLinks?: SocialLinkRequest[];
  certifications?: CertificationRequest[];
  customSections?: CustomSectionRequest[];
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  name: string;
  bio?: string;
  accountType: ProfileAccess;
  profilePicture?: string;
  role?: string;
  location?: string;
  socialLinks?: SocialLinkResponse[];
  certifications?: CertificationResponse[];
  customSections?: CustomSectionResponse[];
}

export interface CustomSectionResponse<
  T extends CustomSectionType = CustomSectionType
> {
  title: T;
  details: CustomSectionDetails[T];
}

/**
 * Certification response DTO
 */
export interface CertificationResponse {
  name: string;
  issuer: string;
  imageURL: string;
  certType: string;
  specializations: string[];
}

/**
 * Social link response DTO
 */
export interface SocialLinkResponse {
  platform: SocialPlatform;
  url: string;
}
