export type UserGender = 'woman' | 'man' | 'non-binary' | 'other';
export type UserStatus = 'active' | 'suspended' | 'banned';
export type UserRole = 'user' | 'admin';
export type LikeType = 'LIKE' | 'SUPER_LIKE';
export type MatchStatus = 'active' | 'unmatched';
export type MessageType = 'text' | 'image';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type RelationshipIntention = 
  | 'Long-term relationship'
  | 'Short-term dating'
  | 'Friendship'
  | 'Casual dating'
  | 'Marriage'
  | 'Still figuring it out';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  date_of_birth: string; // YYYY-MM-DD
  age?: number;
  gender: UserGender;
  location: string;
  created_at: string;
  updated_at: string;
  status: UserStatus;
  is_verified: boolean;
  role: UserRole;
  last_active?: string;
  is_online?: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string;
  occupation: string;
  education: string;
  height: string; // e.g. "5'10\"" or "178 cm"
  pronouns: string;
  relationship_intention: RelationshipIntention;
  lifestyle_data: LifestyleData;
}

export interface LifestyleData {
  drinking?: 'Frequently' | 'Socially' | 'Rarely' | 'Never' | 'Not specified';
  smoking?: 'Regularly' | 'Socially' | 'Trying to quit' | 'Never' | 'Not specified';
  pets?: string[]; // e.g. ["Dog lover", "Cat person", "Has dogs"]
  exercise?: 'Every day' | 'Often' | 'Sometimes' | 'Never' | 'Not specified';
  diet?: 'Omnivore' | 'Vegetarian' | 'Vegan' | 'Pescatarian' | 'Halal' | 'Kosher' | 'Other';
  sleep_schedule?: 'Early bird' | 'Night owl' | 'Flexible' | 'Not specified';
  languages?: string[];
}

export interface Photo {
  id: string;
  user_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
  category?: string;
}

export interface Preferences {
  user_id: string;
  min_age: number;
  max_age: number;
  max_distance: number; // in km
  preferred_gender: string[]; // e.g. ['woman', 'man', 'non-binary']
  relationship_intention: RelationshipIntention[];
  verified_only?: boolean;
}

export interface Like {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: LikeType;
  created_at: string;
}

export interface Match {
  id: string;
  user_one_id: string;
  user_two_id: string;
  created_at: string;
  status: MatchStatus;
  // Hydrated helper fields
  other_user?: HydratedProfile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  message: string;
  message_type: MessageType;
  created_at: string;
  read_at: string | null;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string;
  status: ReportStatus;
  created_at: string;
  // Hydrated
  reporter_name?: string;
  reported_name?: string;
}

export interface Block {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'match' | 'message' | 'like' | 'super_like' | 'verification' | 'safety';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link_to?: string;
}

export interface HydratedProfile extends User {
  profile?: Profile;
  photos: Photo[];
  interests: string[];
  preferences?: Preferences;
  distance_km?: number;
  match_score?: number;
}

export interface FilterOptions {
  min_age: number;
  max_age: number;
  max_distance: number;
  genders: string[];
  intentions: string[];
  interests: string[];
  verified_only: boolean;
  lifestyle?: {
    exercise?: string;
    smoking?: string;
    drinking?: string;
  };
}

export interface AuthSession {
  user: HydratedProfile;
  token: string;
}
