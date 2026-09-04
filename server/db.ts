import fs from 'fs';
import path from 'path';
import { 
  User, Profile, Photo, Interest, Preferences, Like, Match, 
  Message, Report, Block, NotificationItem, HydratedProfile, FilterOptions, RelationshipIntention
} from '../src/types.ts';

interface DatabaseSchema {
  users: User[];
  profiles: Profile[];
  photos: Photo[];
  interests: Interest[];
  user_interests: { user_id: string; interest_id: string }[];
  preferences: Preferences[];
  likes: Like[];
  matches: Match[];
  messages: Message[];
  reports: Report[];
  blocks: Block[];
  notifications: NotificationItem[];
}

const DB_FILE = path.join(process.cwd(), 'data_connectly_db.json');

// Calculate age from date_of_birth
export function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// 20+ Realistic Seed Users
const INITIAL_INTERESTS: Interest[] = [
  { id: 'int_1', name: 'Music' },
  { id: 'int_2', name: 'Movies' },
  { id: 'int_3', name: 'Travel' },
  { id: 'int_4', name: 'Photography' },
  { id: 'int_5', name: 'Gaming' },
  { id: 'int_6', name: 'Fitness' },
  { id: 'int_7', name: 'Cooking' },
  { id: 'int_8', name: 'Reading' },
  { id: 'int_9', name: 'Art' },
  { id: 'int_10', name: 'Sports' },
  { id: 'int_11', name: 'Technology' },
  { id: 'int_12', name: 'Fashion' },
  { id: 'int_13', name: 'Dancing' },
  { id: 'int_14', name: 'Nature' },
  { id: 'int_15', name: 'Food' },
  { id: 'int_16', name: 'Pets' },
  { id: 'int_17', name: 'Coffee' },
  { id: 'int_18', name: 'Yoga' },
  { id: 'int_19', name: 'Hiking' },
  { id: 'int_20', name: 'Writing' }
];

const SEED_USERS_DATA: Array<{
  user: Omit<User, 'age'>;
  profile: Omit<Profile, 'id' | 'user_id'>;
  photos: string[];
  interests: string[];
  preferences: Omit<Preferences, 'user_id'>;
}> = [
  {
    user: {
      id: 'usr_me',
      name: 'Taylor Morgan',
      email: 'taylor@connectly.app',
      password_hash: 'password123',
      date_of_birth: '1998-04-12',
      gender: 'non-binary',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Just now'
    },
    profile: {
      bio: 'Product designer obsessed with specialty coffee, film cameras, and trail running on misty mornings. Looking for deep conversations and spontaneous road trips.',
      occupation: 'Lead Product Designer',
      education: 'UC Berkeley',
      height: "5'9\"",
      pronouns: 'they/them',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover', 'Has dogs'],
        exercise: 'Often',
        diet: 'Vegetarian',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Spanish']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Design', 'Coffee', 'Photography', 'Hiking', 'Music', 'Travel'],
    preferences: {
      min_age: 23,
      max_age: 35,
      max_distance: 40,
      preferred_gender: ['woman', 'man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage'],
      verified_only: false
    }
  },
  {
    user: {
      id: 'usr_admin',
      name: 'Admin Moderator',
      email: 'admin@connectly.app',
      password_hash: 'admin123',
      date_of_birth: '1992-01-15',
      gender: 'other',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'admin',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Connectly Community Trust & Safety Team. Dedicated to keeping our community respectful, safe, and authentic.',
      occupation: 'Safety Lead',
      education: 'Stanford University',
      height: "5'11\"",
      pronouns: 'she/they',
      relationship_intention: 'Still figuring it out',
      lifestyle_data: {
        drinking: 'Rarely',
        smoking: 'Never',
        pets: ['Cat person'],
        exercise: 'Sometimes',
        diet: 'Omnivore',
        sleep_schedule: 'Flexible',
        languages: ['English', 'French']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Technology', 'Reading', 'Art', 'Nature'],
    preferences: {
      min_age: 25,
      max_age: 40,
      max_distance: 50,
      preferred_gender: ['woman', 'man', 'non-binary'],
      relationship_intention: ['Long-term relationship'],
      verified_only: false
    }
  },
  {
    user: {
      id: 'usr_1',
      name: 'Sophia Chen',
      email: 'sophia.c@example.com',
      password_hash: 'password123',
      date_of_birth: '1999-03-21',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Architect by day, ceramicist by weekend. Living for golden hour gallery walks, farmers markets, and discovering hidden noodle spots.',
      occupation: 'Architectural Designer',
      education: 'Columbia University',
      height: "5'7\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Cat person'],
        exercise: 'Often',
        diet: 'Pescatarian',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Mandarin']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Coffee', 'Travel', 'Architecture', 'Cooking', 'Music'],
    preferences: {
      min_age: 24,
      max_age: 34,
      max_distance: 30,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_2',
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      password_hash: 'password123',
      date_of_birth: '1996-08-14',
      gender: 'man',
      location: 'Oakland, CA',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '2 hours ago'
    },
    profile: {
      bio: 'Sound engineer and vinyl collector. Always planning my next backpacking trip or perfecting my sourdough starter. Tell me your top 3 albums.',
      occupation: 'Audio Engineer & Producer',
      education: 'Berklee College of Music',
      height: "6'1\"",
      pronouns: 'he/him',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover', 'Has dogs'],
        exercise: 'Often',
        diet: 'Omnivore',
        sleep_schedule: 'Night owl',
        languages: ['English']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Music', 'Hiking', 'Cooking', 'Photography', 'Travel'],
    preferences: {
      min_age: 23,
      max_age: 33,
      max_distance: 40,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_3',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      password_hash: 'password123',
      date_of_birth: '1997-11-03',
      gender: 'woman',
      location: 'Berkeley, CA',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Marine biologist & scuba divemaster. Passionate about ocean conservation, indie bookstores, and late-night spicy hotpot debates.',
      occupation: 'Marine Biologist',
      education: 'UC Santa Cruz',
      height: "5'6\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Every day',
        diet: 'Pescatarian',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Russian', 'Spanish']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Nature', 'Fitness', 'Reading', 'Travel', 'Food', 'Yoga'],
    preferences: {
      min_age: 25,
      max_age: 36,
      max_distance: 25,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_4',
      name: 'Julian Mercer',
      email: 'julian.m@example.com',
      password_hash: 'password123',
      date_of_birth: '1995-05-29',
      gender: 'man',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: false,
      role: 'user',
      is_online: false,
      last_active: '5 hours ago'
    },
    profile: {
      bio: 'Botanist running an urban plant conservatory. Big fan of weekend trail cycling, jazz cafes, and making homemade pasta from scratch.',
      occupation: 'Horticulturist',
      education: 'UC Davis',
      height: "6'0\"",
      pronouns: 'he/him',
      relationship_intention: 'Casual dating',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Socially',
        pets: ['Cat person', 'Dog lover'],
        exercise: 'Often',
        diet: 'Vegetarian',
        sleep_schedule: 'Flexible',
        languages: ['English']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Nature', 'Cooking', 'Cycling', 'Music', 'Coffee'],
    preferences: {
      min_age: 23,
      max_age: 35,
      max_distance: 35,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Casual dating', 'Short-term dating']
    }
  },
  {
    user: {
      id: 'usr_5',
      name: 'Amara Okafor',
      email: 'amara.o@example.com',
      password_hash: 'password123',
      date_of_birth: '1998-09-17',
      gender: 'woman',
      location: 'San Jose, CA',
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Curator & documentary filmmaker exploring folklore and contemporary art. Looking for someone grounded, humorous, and curious about the world.',
      occupation: 'Art Curator',
      education: 'NYU Tisch',
      height: "5'8\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Sometimes',
        diet: 'Omnivore',
        sleep_schedule: 'Night owl',
        languages: ['English', 'Igbo', 'French']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Movies', 'Photography', 'Travel', 'Writing'],
    preferences: {
      min_age: 25,
      max_age: 38,
      max_distance: 50,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_6',
      name: 'Liam Gallagher',
      email: 'liam.g@example.com',
      password_hash: 'password123',
      date_of_birth: '1994-02-08',
      gender: 'man',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: 'Yesterday'
    },
    profile: {
      bio: 'Rock climbing coach & environmental lawyer. I spend my weekends in Yosemite or brewing pour-overs with ambient lo-fi tracks in the background.',
      occupation: 'Environmental Attorney',
      education: 'Georgetown Law',
      height: "6'2\"",
      pronouns: 'he/him',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Has dogs'],
        exercise: 'Every day',
        diet: 'Omnivore',
        sleep_schedule: 'Early bird',
        languages: ['English']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Fitness', 'Hiking', 'Coffee', 'Reading', 'Nature'],
    preferences: {
      min_age: 26,
      max_age: 36,
      max_distance: 30,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_7',
      name: 'Maya Patel',
      email: 'maya.p@example.com',
      password_hash: 'password123',
      date_of_birth: '2000-06-30',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Robotics software researcher and amateur stand-up comic. Can teach you how to build a quadcopter or where to find the crispest croissants in the city.',
      occupation: 'Robotics Engineer',
      education: 'Carnegie Mellon',
      height: "5'5\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Cat person'],
        exercise: 'Often',
        diet: 'Vegetarian',
        sleep_schedule: 'Flexible',
        languages: ['English', 'Hindi', 'Gujarati']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Technology', 'Gaming', 'Food', 'Travel', 'Comedy', 'Music'],
    preferences: {
      min_age: 23,
      max_age: 32,
      max_distance: 25,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Friendship']
    }
  },
  {
    user: {
      id: 'usr_8',
      name: 'Lucas Silva',
      email: 'lucas.s@example.com',
      password_hash: 'password123',
      date_of_birth: '1996-12-04',
      gender: 'man',
      location: 'Palo Alto, CA',
      created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '3 hours ago'
    },
    profile: {
      bio: 'Bossa nova guitarist & pastry chef. Born in Rio, settled in the Bay. Let me bake you warm pastel de nata and share stories from South America.',
      occupation: 'Pastry Chef & Musician',
      education: 'Culinary Institute of America',
      height: "5'10\"",
      pronouns: 'he/him',
      relationship_intention: 'Marriage',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Often',
        diet: 'Omnivore',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Portuguese', 'Spanish']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Cooking', 'Music', 'Travel', 'Food', 'Dancing'],
    preferences: {
      min_age: 24,
      max_age: 34,
      max_distance: 40,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_9',
      name: 'Zoe Nakamura',
      email: 'zoe.n@example.com',
      password_hash: 'password123',
      date_of_birth: '1997-07-22',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Ceramicist & matcha enthusiast. You will usually find me covered in clay at my studio or biking along the Embarcadero with a film camera.',
      occupation: 'Ceramic Artist',
      education: 'Rhode Island School of Design',
      height: "5'4\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Rarely',
        smoking: 'Never',
        pets: ['Cat person', 'Has cats'],
        exercise: 'Sometimes',
        diet: 'Pescatarian',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Japanese']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Photography', 'Coffee', 'Nature', 'Reading'],
    preferences: {
      min_age: 25,
      max_age: 35,
      max_distance: 30,
      preferred_gender: ['man', 'woman', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_10',
      name: 'Kofi Mensah',
      email: 'kofi.m@example.com',
      password_hash: 'password123',
      date_of_birth: '1995-10-10',
      gender: 'man',
      location: 'Oakland, CA',
      created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '1 hour ago'
    },
    profile: {
      bio: 'Clean-tech founder working on renewable grid storage. Weekend trail runner, Afrobeats DJ, and passionate about community gardens.',
      occupation: 'Climate Tech Founder',
      education: 'MIT',
      height: "6'3\"",
      pronouns: 'he/him',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Every day',
        diet: 'Omnivore',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Twi']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Technology', 'Fitness', 'Music', 'Hiking', 'Dancing'],
    preferences: {
      min_age: 25,
      max_age: 36,
      max_distance: 35,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_11',
      name: 'Chloe Laurent',
      email: 'chloe.l@example.com',
      password_hash: 'password123',
      date_of_birth: '1998-01-25',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Fashion archivist & vintage boutique owner. Lover of flea markets in Paris, natural wine, typography, and French cinema.',
      occupation: 'Vintage Curator',
      education: 'Sorbonne University',
      height: "5'7\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Socially',
        pets: ['Dog lover'],
        exercise: 'Sometimes',
        diet: 'Omnivore',
        sleep_schedule: 'Night owl',
        languages: ['English', 'French', 'Italian']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Fashion', 'Movies', 'Travel', 'Art', 'Coffee'],
    preferences: {
      min_age: 25,
      max_age: 38,
      max_distance: 30,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_12',
      name: 'David Kim',
      email: 'david.k@example.com',
      password_hash: 'password123',
      date_of_birth: '1993-09-12',
      gender: 'man',
      location: 'San Jose, CA',
      created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '4 hours ago'
    },
    profile: {
      bio: 'Game designer & indie developer. Into tabletop strategy games, sci-fi novels, specialty pour-overs, and bouldering.',
      occupation: 'Senior Game Designer',
      education: 'UC Irvine',
      height: "5'11\"",
      pronouns: 'he/him',
      relationship_intention: 'Still figuring it out',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Cat person', 'Dog lover'],
        exercise: 'Often',
        diet: 'Omnivore',
        sleep_schedule: 'Night owl',
        languages: ['English', 'Korean']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Gaming', 'Technology', 'Reading', 'Coffee', 'Fitness'],
    preferences: {
      min_age: 24,
      max_age: 35,
      max_distance: 40,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Still figuring it out', 'Short-term dating']
    }
  },
  {
    user: {
      id: 'usr_13',
      name: 'Isabella Rossi',
      email: 'isabella.r@example.com',
      password_hash: 'password123',
      date_of_birth: '1999-05-18',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Sommelier and food writer. Traveling through vineyards, hosting dinner parties, and hunting down the best handmade gnocchi in town.',
      occupation: 'Sommelier & Writer',
      education: 'University of Gastronomic Sciences',
      height: "5'6\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Sometimes',
        diet: 'Omnivore',
        sleep_schedule: 'Flexible',
        languages: ['English', 'Italian']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Food', 'Travel', 'Writing', 'Cooking', 'Music'],
    preferences: {
      min_age: 25,
      max_age: 38,
      max_distance: 35,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_14',
      name: 'Tariq Al-Mansoor',
      email: 'tariq.a@example.com',
      password_hash: 'password123',
      date_of_birth: '1994-11-20',
      gender: 'man',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 32 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: false,
      role: 'user',
      is_online: false,
      last_active: '6 hours ago'
    },
    profile: {
      bio: 'Civil engineer focused on sustainable transit. Cyclist, amateur astrophotographer, and believer that kindness and curiosity make the best partners.',
      occupation: 'Urban Transit Engineer',
      education: 'UCLA',
      height: "6'1\"",
      pronouns: 'he/him',
      relationship_intention: 'Marriage',
      lifestyle_data: {
        drinking: 'Never',
        smoking: 'Never',
        pets: ['Cat person'],
        exercise: 'Often',
        diet: 'Halal',
        sleep_schedule: 'Early bird',
        languages: ['English', 'Arabic']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Technology', 'Photography', 'Cycling', 'Travel', 'Reading'],
    preferences: {
      min_age: 24,
      max_age: 34,
      max_distance: 30,
      preferred_gender: ['woman'],
      relationship_intention: ['Marriage', 'Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_15',
      name: 'Camila Morales',
      email: 'camila.m@example.com',
      password_hash: 'password123',
      date_of_birth: '1997-03-08',
      gender: 'woman',
      location: 'Oakland, CA',
      created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Salsa instructor & pediatric nurse. Big energy, contagious laugh, and passionate about music that makes you want to get up and dance.',
      occupation: 'Pediatric Nurse & Dance Teacher',
      education: 'University of San Francisco',
      height: "5'5\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover', 'Has dogs'],
        exercise: 'Every day',
        diet: 'Omnivore',
        sleep_schedule: 'Flexible',
        languages: ['English', 'Spanish']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Dancing', 'Music', 'Fitness', 'Travel', 'Food'],
    preferences: {
      min_age: 26,
      max_age: 38,
      max_distance: 30,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_16',
      name: 'Nico Brooks',
      email: 'nico.b@example.com',
      password_hash: 'password123',
      date_of_birth: '1998-08-30',
      gender: 'non-binary',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Illustrator and zine maker. Always sketching dogs in Dolores Park or hunting for vintage synthesizers. Seeking someone genuine and playful.',
      occupation: 'Freelance Illustrator',
      education: 'California College of the Arts',
      height: "5'8\"",
      pronouns: 'they/them',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Rarely',
        smoking: 'Never',
        pets: ['Dog lover', 'Cat person'],
        exercise: 'Sometimes',
        diet: 'Vegan',
        sleep_schedule: 'Night owl',
        languages: ['English']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Music', 'Coffee', 'Reading', 'Pets'],
    preferences: {
      min_age: 23,
      max_age: 35,
      max_distance: 35,
      preferred_gender: ['woman', 'man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Friendship']
    }
  },
  {
    user: {
      id: 'usr_17',
      name: 'Noah Sterling',
      email: 'noah.s@example.com',
      password_hash: 'password123',
      date_of_birth: '1995-04-03',
      gender: 'man',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 29 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '2 hours ago'
    },
    profile: {
      bio: 'Woodworker crafting custom Scandinavian furniture. Big reader, loves camping under desert stars and cooking slow-simmered stews.',
      occupation: 'Furniture Artisan',
      education: 'Oregon State University',
      height: "6'2\"",
      pronouns: 'he/him',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover', 'Has dogs'],
        exercise: 'Often',
        diet: 'Omnivore',
        sleep_schedule: 'Early bird',
        languages: ['English']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Nature', 'Art', 'Reading', 'Cooking', 'Hiking'],
    preferences: {
      min_age: 24,
      max_age: 34,
      max_distance: 40,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  },
  {
    user: {
      id: 'usr_18',
      name: 'Leila Farrokh',
      email: 'leila.f@example.com',
      password_hash: 'password123',
      date_of_birth: '1996-06-19',
      gender: 'woman',
      location: 'Berkeley, CA',
      created_at: new Date(Date.now() - 24 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Astrophysics postdoc gazing at distant galaxies by night, practicing vinyasa yoga by day. Looking for someone with emotional intelligence and intellectual curiosity.',
      occupation: 'Astrophysicist',
      education: 'UC Berkeley PhD',
      height: "5'6\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Rarely',
        smoking: 'Never',
        pets: ['Cat person'],
        exercise: 'Every day',
        diet: 'Vegetarian',
        sleep_schedule: 'Flexible',
        languages: ['English', 'Persian', 'German']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Yoga', 'Reading', 'Technology', 'Nature', 'Coffee'],
    preferences: {
      min_age: 26,
      max_age: 38,
      max_distance: 30,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_19',
      name: 'Samir Ghosh',
      email: 'samir.g@example.com',
      password_hash: 'password123',
      date_of_birth: '1997-02-14',
      gender: 'man',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 19 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: false,
      last_active: '40 mins ago'
    },
    profile: {
      bio: 'Photojournalist covering cultural festivals & environmental restoration. High energy, loves street food night markets, and impromptu guitar jams.',
      occupation: 'Photojournalist',
      education: 'Northwestern University',
      height: "5'10\"",
      pronouns: 'he/him',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover'],
        exercise: 'Often',
        diet: 'Omnivore',
        sleep_schedule: 'Flexible',
        languages: ['English', 'Bengali', 'Hindi']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Photography', 'Travel', 'Music', 'Food', 'Writing'],
    preferences: {
      min_age: 23,
      max_age: 33,
      max_distance: 35,
      preferred_gender: ['woman', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    }
  },
  {
    user: {
      id: 'usr_20',
      name: 'Olivia Wright',
      email: 'olivia.w@example.com',
      password_hash: 'password123',
      date_of_birth: '1999-10-05',
      gender: 'woman',
      location: 'San Francisco, CA',
      created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: true,
      role: 'user',
      is_online: true,
      last_active: 'Online'
    },
    profile: {
      bio: 'Veterinarian with a heart for rescue animals. Big on cozy rainy days, making handmade pottery, and hiking along coastal bluffs.',
      occupation: 'Veterinary Surgeon',
      education: 'UC Davis School of Veterinary Medicine',
      height: "5'6\"",
      pronouns: 'she/her',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {
        drinking: 'Socially',
        smoking: 'Never',
        pets: ['Dog lover', 'Cat person', 'Has dogs'],
        exercise: 'Often',
        diet: 'Pescatarian',
        sleep_schedule: 'Early bird',
        languages: ['English', 'French']
      }
    },
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Pets', 'Hiking', 'Nature', 'Cooking', 'Coffee'],
    preferences: {
      min_age: 24,
      max_age: 35,
      max_distance: 25,
      preferred_gender: ['man', 'non-binary'],
      relationship_intention: ['Long-term relationship', 'Marriage']
    }
  }
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing fresh:', err);
    }

    return this.initializeSeedDatabase();
  }

  public save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  private initializeSeedDatabase(): DatabaseSchema {
    const users: User[] = [];
    const profiles: Profile[] = [];
    const photos: Photo[] = [];
    const user_interests: { user_id: string; interest_id: string }[] = [];
    const preferences: Preferences[] = [];
    const likes: Like[] = [];
    const matches: Match[] = [];
    const messages: Message[] = [];
    const reports: Report[] = [];
    const blocks: Block[] = [];
    const notifications: NotificationItem[] = [];

    // Populate Users, Profiles, Photos, Interests, Preferences
    SEED_USERS_DATA.forEach((entry, idx) => {
      const user: User = {
        ...entry.user,
        age: calculateAge(entry.user.date_of_birth)
      };
      users.push(user);

      profiles.push({
        id: `prof_${entry.user.id}`,
        user_id: entry.user.id,
        ...entry.profile
      });

      entry.photos.forEach((url, pIdx) => {
        photos.push({
          id: `pho_${entry.user.id}_${pIdx}`,
          user_id: entry.user.id,
          image_url: url,
          is_primary: pIdx === 0,
          display_order: pIdx,
          created_at: new Date(Date.now() - (idx + 1) * 86400000).toISOString()
        });
      });

      entry.interests.forEach(intName => {
        let existingInt = INITIAL_INTERESTS.find(i => i.name.toLowerCase() === intName.toLowerCase());
        if (!existingInt) {
          existingInt = { id: `int_${INITIAL_INTERESTS.length + 1}`, name: intName };
          INITIAL_INTERESTS.push(existingInt);
        }
        user_interests.push({ user_id: entry.user.id, interest_id: existingInt.id });
      });

      preferences.push({
        user_id: entry.user.id,
        ...entry.preferences
      });
    });

    // Seed mutual matches and likes for the default logged-in user ('usr_me')
    // 1. Sophia Chen (usr_1) already liked Taylor ('usr_me') and they matched!
    likes.push(
      { id: 'like_1a', sender_id: 'usr_1', receiver_id: 'usr_me', type: 'LIKE', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 'like_1b', sender_id: 'usr_me', receiver_id: 'usr_1', type: 'LIKE', created_at: new Date(Date.now() - 2 * 86400000).toISOString() }
    );
    matches.push({
      id: 'match_1',
      user_one_id: 'usr_me',
      user_two_id: 'usr_1',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'active'
    });
    // Seed chat history for match_1
    messages.push(
      {
        id: 'msg_1_1',
        match_id: 'match_1',
        sender_id: 'usr_1',
        message: 'Hey Taylor! I saw in your profile that you love specialty pour-overs! Have you tried the new Ethiopian roast at Saint Frank?',
        message_type: 'text',
        created_at: new Date(Date.now() - 40 * 3600000).toISOString(),
        read_at: new Date(Date.now() - 39 * 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_1_2',
        match_id: 'match_1',
        sender_id: 'usr_me',
        message: "Hey Sophia! Yes! Saint Frank's natural process is incredible. We should definitely grab one sometime and check out the gallery on Polk Street.",
        message_type: 'text',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
        read_at: new Date(Date.now() - 23 * 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_1_3',
        match_id: 'match_1',
        sender_id: 'usr_1',
        message: "I'd love that! Are you free this Saturday afternoon around 2?",
        message_type: 'text',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        read_at: null,
        status: 'delivered'
      }
    );

    // 2. Marcus Vance (usr_2) matched with Taylor
    likes.push(
      { id: 'like_2a', sender_id: 'usr_2', receiver_id: 'usr_me', type: 'SUPER_LIKE', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: 'like_2b', sender_id: 'usr_me', receiver_id: 'usr_2', type: 'LIKE', created_at: new Date(Date.now() - 3 * 86400000).toISOString() }
    );
    matches.push({
      id: 'match_2',
      user_one_id: 'usr_me',
      user_two_id: 'usr_2',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'active'
    });
    messages.push(
      {
        id: 'msg_2_1',
        match_id: 'match_2',
        sender_id: 'usr_2',
        message: 'Loved your trail running photos! Have you done the Dipsea trail yet?',
        message_type: 'text',
        created_at: new Date(Date.now() - 15 * 3600000).toISOString(),
        read_at: new Date(Date.now() - 14 * 3600000).toISOString(),
        status: 'read'
      }
    );

    // 3. Elena Rostova (usr_3) liked Taylor (so Taylor sees her in Likes page!)
    likes.push({
      id: 'like_3',
      sender_id: 'usr_3',
      receiver_id: 'usr_me',
      type: 'LIKE',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    });

    // 4. Olivia Wright (usr_20) Super Liked Taylor!
    likes.push({
      id: 'like_4',
      sender_id: 'usr_20',
      receiver_id: 'usr_me',
      type: 'SUPER_LIKE',
      created_at: new Date(Date.now() - 5 * 3600000).toISOString()
    });

    // Notifications for Taylor
    notifications.push(
      {
        id: 'notif_1',
        user_id: 'usr_me',
        type: 'match',
        title: "It's a Match! 🎉",
        message: 'You and Sophia Chen liked each other. Say hello!',
        is_read: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        link_to: '/messages/match_1'
      },
      {
        id: 'notif_2',
        user_id: 'usr_me',
        type: 'super_like',
        title: 'New Super Like ⭐',
        message: 'Someone Super Liked your profile!',
        is_read: false,
        created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
        link_to: '/likes'
      },
      {
        id: 'notif_3',
        user_id: 'usr_me',
        type: 'message',
        title: 'New Message from Sophia 💬',
        message: '"I\'d love that! Are you free this Saturday afternoon around 2?"',
        is_read: false,
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        link_to: '/messages/match_1'
      }
    );

    // Seed report for admin testing
    reports.push(
      {
        id: 'rep_1',
        reporter_id: 'usr_1',
        reported_user_id: 'usr_4',
        reason: 'Spam',
        description: 'Sent commercial promotional links in profile description.',
        status: 'pending',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        id: 'rep_2',
        reporter_id: 'usr_5',
        reported_user_id: 'usr_14',
        reason: 'Fake profile',
        description: 'Profile photos appear to be stolen stock photography.',
        status: 'reviewing',
        created_at: new Date(Date.now() - 48 * 3600000).toISOString()
      }
    );

    const schema: DatabaseSchema = {
      users,
      profiles,
      photos,
      interests: INITIAL_INTERESTS,
      user_interests,
      preferences,
      likes,
      matches,
      messages,
      reports,
      blocks,
      notifications
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error creating initial database file:', e);
    }

    return schema;
  }

  // --- GETTERS & RELATIONAL QUERIES ---

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    const user = this.data.users.find(u => u.id === id);
    if (user) {
      user.age = calculateAge(user.date_of_birth);
    }
    return user;
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getProfileByUserId(userId: string): Profile | undefined {
    return this.data.profiles.find(p => p.user_id === userId);
  }

  public getPhotosByUserId(userId: string): Photo[] {
    return this.data.photos
      .filter(p => p.user_id === userId)
      .sort((a, b) => a.display_order - b.display_order);
  }

  public getInterestsByUserId(userId: string): string[] {
    const interestIds = this.data.user_interests
      .filter(ui => ui.user_id === userId)
      .map(ui => ui.interest_id);

    return this.data.interests
      .filter(i => interestIds.includes(i.id))
      .map(i => i.name);
  }

  public getPreferencesByUserId(userId: string): Preferences | undefined {
    return this.data.preferences.find(p => p.user_id === userId);
  }

  public getHydratedProfile(userId: string, currentUserId?: string): HydratedProfile | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;

    const profile = this.getProfileByUserId(userId);
    const photos = this.getPhotosByUserId(userId);
    const interests = this.getInterestsByUserId(userId);
    const preferences = this.getPreferencesByUserId(userId);

    // Calculate approximate distance (stable pseudo-distance based on IDs)
    let distance_km = 8;
    if (currentUserId && currentUserId !== userId) {
      const hash = (userId + currentUserId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      distance_km = (hash % 28) + 2; // Between 2 km and 30 km
    }

    // Calculate compatibility score if current user provided
    let match_score = 80;
    if (currentUserId && currentUserId !== userId) {
      const currentUserProfile = this.getHydratedProfile(currentUserId);
      if (currentUserProfile) {
        match_score = this.calculateCompatibilityScore(currentUserProfile, {
          ...user,
          profile,
          photos,
          interests,
          preferences,
          distance_km
        });
      }
    }

    return {
      ...user,
      profile,
      photos,
      interests,
      preferences,
      distance_km,
      match_score
    };
  }

  // --- MATCHING COMPATIBILITY ALGORITHM (Section 7) ---
  // Shared interests: 30%
  // Relationship intention: 20%
  // Age preference: 15%
  // Distance: 15%
  // Lifestyle compatibility: 10%
  // Languages: 5%
  // Other compatibility: 5%
  public calculateCompatibilityScore(userA: HydratedProfile, userB: HydratedProfile): number {
    let score = 0;

    // 1. Shared Interests (up to 30%)
    const sharedInterests = userA.interests.filter(i => 
      userB.interests.some(bi => bi.toLowerCase() === i.toLowerCase())
    );
    const interestScore = Math.min(30, sharedInterests.length * 8 + 6);
    score += interestScore;

    // 2. Relationship Intention (20%)
    const intentionA = userA.profile?.relationship_intention;
    const intentionB = userB.profile?.relationship_intention;
    if (intentionA && intentionB && intentionA === intentionB) {
      score += 20;
    } else if (
      (intentionA === 'Long-term relationship' && intentionB === 'Marriage') ||
      (intentionA === 'Marriage' && intentionB === 'Long-term relationship')
    ) {
      score += 16;
    } else {
      score += 8;
    }

    // 3. Age Preference (15%)
    const ageB = userB.age || calculateAge(userB.date_of_birth);
    const prefA = userA.preferences;
    if (prefA && ageB >= prefA.min_age && ageB <= prefA.max_age) {
      score += 15;
    } else {
      score += 8;
    }

    // 4. Distance (15%)
    const dist = userB.distance_km ?? 12;
    if (dist <= 10) score += 15;
    else if (dist <= 25) score += 12;
    else if (dist <= 50) score += 8;
    else score += 4;

    // 5. Lifestyle Compatibility (10%)
    let lifeScore = 6;
    const lifeA = userA.profile?.lifestyle_data;
    const lifeB = userB.profile?.lifestyle_data;
    if (lifeA && lifeB) {
      if (lifeA.smoking === lifeB.smoking) lifeScore += 2;
      if (lifeA.exercise === lifeB.exercise) lifeScore += 2;
    }
    score += Math.min(10, lifeScore);

    // 6. Common Languages (5%)
    const langsA = lifeA?.languages || ['English'];
    const langsB = lifeB?.languages || ['English'];
    const commonLang = langsA.some(l => langsB.includes(l));
    score += commonLang ? 5 : 2;

    // 7. Base verification / profile detail quality (5%)
    if (userB.is_verified) score += 3;
    if (userB.photos.length >= 2) score += 2;

    return Math.min(98, Math.max(45, score));
  }

  // --- DISCOVERY ---
  public getDiscoverProfiles(currentUserId: string, filters?: Partial<FilterOptions>): HydratedProfile[] {
    const currentUser = this.getHydratedProfile(currentUserId);
    if (!currentUser) return [];

    // Get IDs of users already liked or passed or blocked
    const userLikes = this.data.likes
      .filter(l => l.sender_id === currentUserId)
      .map(l => l.receiver_id);

    const userBlocks = this.data.blocks
      .filter(b => b.blocker_id === currentUserId || b.blocked_id === currentUserId)
      .map(b => b.blocker_id === currentUserId ? b.blocked_id : b.blocker_id);

    // Exclude current user, already acted upon users, blocked users, suspended or banned users, admin
    const candidates = this.data.users.filter(u => {
      if (u.id === currentUserId) return false;
      if (u.role === 'admin') return false;
      if (u.status !== 'active') return false;
      if (userLikes.includes(u.id)) return false;
      if (userBlocks.includes(u.id)) return false;
      return true;
    });

    // Hydrate
    let hydratedList = candidates
      .map(u => this.getHydratedProfile(u.id, currentUserId))
      .filter((hp): hp is HydratedProfile => hp !== undefined);

    // Apply filters if present
    if (filters) {
      if (filters.min_age !== undefined || filters.max_age !== undefined) {
        hydratedList = hydratedList.filter(u => {
          const age = u.age ?? calculateAge(u.date_of_birth);
          if (filters.min_age !== undefined && age < filters.min_age) return false;
          if (filters.max_age !== undefined && age > filters.max_age) return false;
          return true;
        });
      }

      if (filters.genders && filters.genders.length > 0) {
        hydratedList = hydratedList.filter(u => filters.genders!.includes(u.gender));
      }

      if (filters.max_distance !== undefined) {
        hydratedList = hydratedList.filter(u => (u.distance_km ?? 0) <= filters.max_distance!);
      }

      if (filters.intentions && filters.intentions.length > 0) {
        hydratedList = hydratedList.filter(u => 
          u.profile?.relationship_intention && filters.intentions!.includes(u.profile.relationship_intention)
        );
      }

      if (filters.verified_only) {
        hydratedList = hydratedList.filter(u => u.is_verified);
      }

      if (filters.interests && filters.interests.length > 0) {
        hydratedList = hydratedList.filter(u => 
          filters.interests!.some(fav => u.interests.includes(fav))
        );
      }
    }

    // Sort by compatibility match score descending
    hydratedList.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    return hydratedList;
  }

  // --- LIKES & MATCHING ---
  public registerLike(senderId: string, receiverId: string, type: 'LIKE' | 'SUPER_LIKE'): { isMatch: boolean; match?: Match; matchedUser?: HydratedProfile } {
    if (senderId === receiverId) {
      throw new Error('You cannot like yourself.');
    }

    // Check existing like
    const existing = this.data.likes.find(l => l.sender_id === senderId && l.receiver_id === receiverId);
    if (existing) {
      existing.type = type;
      this.save();
    } else {
      const newLike: Like = {
        id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sender_id: senderId,
        receiver_id: receiverId,
        type,
        created_at: new Date().toISOString()
      };
      this.data.likes.push(newLike);
    }

    // Notify receiver
    const sender = this.getUserById(senderId);
    const senderName = sender?.name || 'Someone';
    this.addNotification({
      user_id: receiverId,
      type: type === 'SUPER_LIKE' ? 'super_like' : 'like',
      title: type === 'SUPER_LIKE' ? 'New Super Like! ⭐' : 'Someone liked you ❤️',
      message: `${senderName} ${type === 'SUPER_LIKE' ? 'super liked' : 'liked'} your profile.`,
      link_to: '/likes'
    });

    // Check if receiver has also liked sender (MUTUAL MATCH)
    const mutualLike = this.data.likes.find(l => l.sender_id === receiverId && l.receiver_id === senderId);
    if (mutualLike) {
      // Check existing match
      let match = this.data.matches.find(m => 
        (m.user_one_id === senderId && m.user_two_id === receiverId) ||
        (m.user_one_id === receiverId && m.user_two_id === senderId)
      );

      if (!match) {
        match = {
          id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          user_one_id: senderId,
          user_two_id: receiverId,
          created_at: new Date().toISOString(),
          status: 'active'
        };
        this.data.matches.unshift(match);

        // Notify both users
        const receiver = this.getUserById(receiverId);
        this.addNotification({
          user_id: senderId,
          type: 'match',
          title: "It's a Match! 🎉",
          message: `You and ${receiver?.name || 'your match'} liked each other. Say hello!`,
          link_to: `/messages/${match.id}`
        });

        this.addNotification({
          user_id: receiverId,
          type: 'match',
          title: "It's a Match! 🎉",
          message: `You and ${senderName} liked each other. Say hello!`,
          link_to: `/messages/${match.id}`
        });
      } else if (match.status === 'unmatched') {
        match.status = 'active';
      }

      this.save();
      const matchedProfile = this.getHydratedProfile(receiverId, senderId);
      return { isMatch: true, match, matchedUser: matchedProfile };
    }

    this.save();
    return { isMatch: false };
  }

  public registerPass(senderId: string, receiverId: string): void {
    // Record as special like with type 'PASS' or simply ensure they don't see each other immediately
    const existing = this.data.likes.find(l => l.sender_id === senderId && l.receiver_id === receiverId);
    if (!existing) {
      this.data.likes.push({
        id: `pass_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sender_id: senderId,
        receiver_id: receiverId,
        type: 'LIKE', // Recorded in acted list
        created_at: new Date().toISOString()
      });
      this.save();
    }
  }

  // Get people who liked current user
  public getLikesForUser(userId: string): Array<HydratedProfile & { like_type: 'LIKE' | 'SUPER_LIKE'; liked_at: string }> {
    const incomingLikes = this.data.likes.filter(l => l.receiver_id === userId);
    const results: Array<HydratedProfile & { like_type: 'LIKE' | 'SUPER_LIKE'; liked_at: string }> = [];

    // Filter out people already mutually matched or blocked
    const activeMatchUserIds = this.data.matches
      .filter(m => m.status === 'active' && (m.user_one_id === userId || m.user_two_id === userId))
      .map(m => m.user_one_id === userId ? m.user_two_id : m.user_one_id);

    incomingLikes.forEach(like => {
      if (activeMatchUserIds.includes(like.sender_id)) return;
      const profile = this.getHydratedProfile(like.sender_id, userId);
      if (profile && profile.status === 'active') {
        results.push({
          ...profile,
          like_type: like.type,
          liked_at: like.created_at
        });
      }
    });

    return results;
  }

  // Matches for user
  public getMatchesForUser(userId: string): Match[] {
    const userMatches = this.data.matches.filter(m => 
      m.status === 'active' && (m.user_one_id === userId || m.user_two_id === userId)
    );

    // Hydrate each match
    return userMatches.map(m => {
      const otherUserId = m.user_one_id === userId ? m.user_two_id : m.user_one_id;
      const otherUser = this.getHydratedProfile(otherUserId, userId);

      // Get messages for this match
      const matchMessages = this.data.messages
        .filter(msg => msg.match_id === m.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const lastMessage = matchMessages[0];
      const unreadCount = matchMessages.filter(msg => msg.sender_id === otherUserId && !msg.read_at).length;

      return {
        ...m,
        other_user: otherUser,
        last_message: lastMessage,
        unread_count: unreadCount
      };
    }).sort((a, b) => {
      const timeA = a.last_message?.created_at || a.created_at;
      const timeB = b.last_message?.created_at || b.created_at;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  }

  public unmatch(userId: string, matchId: string): boolean {
    const match = this.data.matches.find(m => m.id === matchId);
    if (!match) return false;
    if (match.user_one_id !== userId && match.user_two_id !== userId) return false;

    match.status = 'unmatched';
    this.save();
    return true;
  }

  // --- MESSAGES ---
  public getMessages(matchId: string, userId: string): Message[] {
    const match = this.data.matches.find(m => m.id === matchId && m.status === 'active');
    if (!match) throw new Error('Match not found or no longer active.');
    if (match.user_one_id !== userId && match.user_two_id !== userId) {
      throw new Error('Unauthorized to view this conversation.');
    }

    return this.data.messages
      .filter(m => m.match_id === matchId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public sendMessage(matchId: string, senderId: string, text: string, messageType: 'text' | 'image' = 'text'): Message {
    const match = this.data.matches.find(m => m.id === matchId && m.status === 'active');
    if (!match) throw new Error('Cannot send message: Mutual match does not exist or has ended.');
    if (match.user_one_id !== senderId && match.user_two_id !== senderId) {
      throw new Error('Unauthorized.');
    }

    const receiverId = match.user_one_id === senderId ? match.user_two_id : match.user_one_id;

    // Check block
    const isBlocked = this.data.blocks.some(b => 
      (b.blocker_id === senderId && b.blocked_id === receiverId) ||
      (b.blocker_id === receiverId && b.blocked_id === senderId)
    );
    if (isBlocked) throw new Error('Messaging unavailable due to safety block.');

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      match_id: matchId,
      sender_id: senderId,
      message: text.trim(),
      message_type: messageType,
      created_at: new Date().toISOString(),
      read_at: null,
      status: 'delivered'
    };

    this.data.messages.push(newMessage);

    const sender = this.getUserById(senderId);
    this.addNotification({
      user_id: receiverId,
      type: 'message',
      title: `Message from ${sender?.name || 'Match'}`,
      message: text.length > 60 ? text.substring(0, 60) + '...' : text,
      link_to: `/messages/${matchId}`
    });

    this.save();
    return newMessage;
  }

  public markMessagesRead(matchId: string, userId: string): void {
    let changed = false;
    this.data.messages.forEach(m => {
      if (m.match_id === matchId && m.sender_id !== userId && !m.read_at) {
        m.read_at = new Date().toISOString();
        m.status = 'read';
        changed = true;
      }
    });
    if (changed) this.save();
  }

  // --- SAFETY: BLOCK & REPORT ---
  public blockUser(blockerId: string, blockedId: string): void {
    if (blockerId === blockedId) return;

    const exists = this.data.blocks.some(b => b.blocker_id === blockerId && b.blocked_id === blockedId);
    if (!exists) {
      this.data.blocks.push({
        blocker_id: blockerId,
        blocked_id: blockedId,
        created_at: new Date().toISOString()
      });

      // Set any active matches to unmatched
      this.data.matches.forEach(m => {
        if ((m.user_one_id === blockerId && m.user_two_id === blockedId) ||
            (m.user_one_id === blockedId && m.user_two_id === blockerId)) {
          m.status = 'unmatched';
        }
      });

      this.save();
    }
  }

  public reportUser(reporterId: string, reportedUserId: string, reason: string, description: string): Report {
    const report: Report = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      description,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.data.reports.push(report);
    this.save();
    return report;
  }

  public getBlockedUsers(userId: string): HydratedProfile[] {
    const blockedIds = this.data.blocks
      .filter(b => b.blocker_id === userId)
      .map(b => b.blocked_id);

    return blockedIds
      .map(id => this.getHydratedProfile(id))
      .filter((p): p is HydratedProfile => p !== undefined);
  }

  public unblockUser(blockerId: string, blockedId: string): boolean {
    const initialLen = this.data.blocks.length;
    this.data.blocks = this.data.blocks.filter(b => !(b.blocker_id === blockerId && b.blocked_id === blockedId));
    if (this.data.blocks.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>): NotificationItem {
    const item: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      is_read: false,
      ...notif
    };
    this.data.notifications.unshift(item);
    this.save();
    return item;
  }

  public markNotificationRead(id: string, userId: string): void {
    const notif = this.data.notifications.find(n => n.id === id && n.user_id === userId);
    if (notif) {
      notif.is_read = true;
      this.save();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.save();
  }

  // --- PROFILE UPDATES & PHOTOS ---
  public updateProfile(userId: string, updates: {
    user?: Partial<User>;
    profile?: Partial<Profile>;
    preferences?: Partial<Preferences>;
    interests?: string[];
  }): HydratedProfile {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    if (updates.user) {
      Object.assign(user, updates.user, { updated_at: new Date().toISOString() });
    }

    let profile = this.getProfileByUserId(userId);
    if (!profile) {
      profile = {
        id: `prof_${userId}`,
        user_id: userId,
        bio: '',
        occupation: '',
        education: '',
        height: '',
        pronouns: '',
        relationship_intention: 'Long-term relationship',
        lifestyle_data: {}
      };
      this.data.profiles.push(profile);
    }
    if (updates.profile) {
      Object.assign(profile, updates.profile);
    }

    let pref = this.getPreferencesByUserId(userId);
    if (!pref) {
      pref = {
        user_id: userId,
        min_age: 18,
        max_age: 60,
        max_distance: 50,
        preferred_gender: ['woman', 'man', 'non-binary'],
        relationship_intention: ['Long-term relationship']
      };
      this.data.preferences.push(pref);
    }
    if (updates.preferences) {
      Object.assign(pref, updates.preferences);
    }

    if (updates.interests) {
      // Clear existing user_interests
      this.data.user_interests = this.data.user_interests.filter(ui => ui.user_id !== userId);
      updates.interests.forEach(intName => {
        let existingInt = this.data.interests.find(i => i.name.toLowerCase() === intName.toLowerCase());
        if (!existingInt) {
          existingInt = { id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, name: intName };
          this.data.interests.push(existingInt);
        }
        this.data.user_interests.push({ user_id: userId, interest_id: existingInt.id });
      });
    }

    this.save();
    return this.getHydratedProfile(userId)!;
  }

  public addPhoto(userId: string, imageUrl: string): Photo {
    const userPhotos = this.getPhotosByUserId(userId);
    if (userPhotos.length >= 6) {
      throw new Error('Maximum of 6 photos reached.');
    }

    const newPhoto: Photo = {
      id: `pho_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      image_url: imageUrl,
      is_primary: userPhotos.length === 0,
      display_order: userPhotos.length,
      created_at: new Date().toISOString()
    };

    this.data.photos.push(newPhoto);
    this.save();
    return newPhoto;
  }

  public deletePhoto(userId: string, photoId: string): void {
    const photo = this.data.photos.find(p => p.id === photoId && p.user_id === userId);
    if (!photo) throw new Error('Photo not found');

    const remainingPhotos = this.data.photos.filter(p => p.user_id === userId && p.id !== photoId);
    if (remainingPhotos.length === 0) {
      throw new Error('You must keep at least 1 profile photo.');
    }

    this.data.photos = this.data.photos.filter(p => p.id !== photoId);

    // If deleted photo was primary, make the first remaining one primary
    if (photo.is_primary && remainingPhotos.length > 0) {
      remainingPhotos[0].is_primary = true;
    }

    // Re-index display orders
    remainingPhotos.forEach((p, idx) => {
      p.display_order = idx;
    });

    this.save();
  }

  public reorderPhotos(userId: string, photoIdsInOrder: string[]): Photo[] {
    const photos = this.data.photos.filter(p => p.user_id === userId);
    photoIdsInOrder.forEach((id, index) => {
      const p = photos.find(item => item.id === id);
      if (p) {
        p.display_order = index;
        p.is_primary = index === 0;
      }
    });

    this.save();
    return this.getPhotosByUserId(userId);
  }

  // --- USER CREATION & AUTH ---
  public createUser(userData: {
    name: string;
    email: string;
    password_hash: string;
    date_of_birth: string;
    gender: any;
    location: string;
  }): HydratedProfile {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const user: User = {
      id,
      name: userData.name,
      email: userData.email,
      password_hash: userData.password_hash,
      date_of_birth: userData.date_of_birth,
      age: calculateAge(userData.date_of_birth),
      gender: userData.gender,
      location: userData.location,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      is_verified: false,
      role: 'user',
      is_online: true,
      last_active: 'Just now'
    };

    this.data.users.push(user);

    // Initial Profile
    const profile: Profile = {
      id: `prof_${id}`,
      user_id: id,
      bio: '',
      occupation: '',
      education: '',
      height: '',
      pronouns: '',
      relationship_intention: 'Long-term relationship',
      lifestyle_data: {}
    };
    this.data.profiles.push(profile);

    // Initial Preferences
    const preferences: Preferences = {
      user_id: id,
      min_age: 18,
      max_age: 50,
      max_distance: 50,
      preferred_gender: ['woman', 'man', 'non-binary'],
      relationship_intention: ['Long-term relationship']
    };
    this.data.preferences.push(preferences);

    // Default primary photo
    this.data.photos.push({
      id: `pho_${id}_0`,
      user_id: id,
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      is_primary: true,
      display_order: 0,
      created_at: new Date().toISOString()
    });

    this.save();
    return this.getHydratedProfile(id)!;
  }

  // --- ADMIN ACTIONS ---
  public getAdminStats() {
    const totalUsers = this.data.users.filter(u => u.role !== 'admin').length;
    const activeUsers = this.data.users.filter(u => u.status === 'active' && u.role !== 'admin').length;
    const totalMatches = this.data.matches.filter(m => m.status === 'active').length;
    const totalMessages = this.data.messages.length;
    const pendingReports = this.data.reports.filter(r => r.status === 'pending').length;
    const blockedAccounts = this.data.users.filter(u => u.status === 'suspended' || u.status === 'banned').length;
    const verifiedProfiles = this.data.users.filter(u => u.is_verified).length;

    return {
      totalUsers,
      activeUsers,
      newRegistrationsToday: 4,
      totalMatches,
      totalMessages,
      pendingReports,
      blockedAccounts,
      verifiedProfiles
    };
  }

  public getAdminUsers(): HydratedProfile[] {
    return this.data.users
      .filter(u => u.role !== 'admin')
      .map(u => this.getHydratedProfile(u.id))
      .filter((p): p is HydratedProfile => p !== undefined);
  }

  public setAdminUserStatus(userId: string, status: 'active' | 'suspended' | 'banned', verified?: boolean): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    user.status = status;
    if (verified !== undefined) {
      user.is_verified = verified;
    }
    user.updated_at = new Date().toISOString();
    this.save();
    return user;
  }

  public getAdminReports(): Report[] {
    return this.data.reports.map(r => {
      const reporter = this.getUserById(r.reporter_id);
      const reported = this.getUserById(r.reported_user_id);
      return {
        ...r,
        reporter_name: reporter?.name || 'Unknown',
        reported_name: reported?.name || 'Unknown'
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public updateReportStatus(reportId: string, status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'): Report {
    const report = this.data.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');
    report.status = status;
    this.save();
    return report;
  }
}

export const db = new DatabaseService();
