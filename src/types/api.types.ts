// API Response Types

// Common Types
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

export interface PaginationResponse {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface PagePaginationResponse {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// User Management Types
export interface UserData {
  id: string;
  email: string;
  name: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserData;
  tokens: TokenData;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  name: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// User Profile Types
export interface SocialLink {
  platform: string;
  url: string;
}

export interface Certification {
  id?: string;
  name: string;
  organization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialURL?: string;
}

export interface CustomSection {
  id?: string;
  title: string;
  content: string;
}

export interface UserProfile {
  _id: string;
  userId: string;
  username: string;
  name: string;
  bio?: string;
  accountType: number;
  profilePicture?: string;
  role?: string;
  location?: string;
  socialLinks?: SocialLink[];
  certifications?: Certification[];
  customSections?: CustomSection[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface UserBasicProfile {
  id: string;
  username: string;
  name: string;
  profilePicture?: string;
}

export interface UserFollowersResponse {
  data: UserBasicProfile[];
  pagination: PaginationResponse;
}

// Group Types
export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  location?: string;
  groupPicture?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserGroupsResponse {
  groups: Group[];
}

export interface JoinRequestResponse {
  id: string;
  status: "PENDING";
  createdAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  maxParticipants?: number;
  currentParticipants: number;
  groupId?: string;
  creatorId: string;
  eventPicture?: string;
  tags?: string[];
  userStatus?: "ATTENDING" | "INTERESTED" | "CREATED";
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    totalEvents: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Search Types
export interface CertificationsSearchResponse {
  certifications: {
    id: string;
    name: string;
    organization: string;
  }[];
  pagination: PagePaginationResponse;
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'profile' | 'group';
  description?: string;
  profilePicture?: string;
  groupPicture?: string;
  tags?: string[];
}

export interface CertificationSearchResult {
  id: string;
  name: string;
  issuer?: string;
  description?: string;
}

export interface ProfilesSearchResponse {
  profiles: {
    id: string;
    username: string;
    name: string;
    profilePicture?: string;
    bio?: string;
  }[];
  groups: {
    id: string;
    name: string;
    description: string;
    groupPicture?: string;
    memberCount: number;
    isPrivate: boolean;
  }[];
  pagination: PagePaginationResponse;
  results?: SearchResult[];
  totalPages?: number;
}
