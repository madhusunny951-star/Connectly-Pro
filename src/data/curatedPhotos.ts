export interface CuratedPhotoItem {
  id: string;
  title: string;
  category: 'Portraits' | 'Outdoor' | 'Cozy' | 'Style' | 'Active';
  url: string;
}

export const CURATED_PORTRAIT_PHOTOS: CuratedPhotoItem[] = [
  // Portraits
  {
    id: 'cur_1',
    title: 'Warm Natural Smile',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_2',
    title: 'Sunlit Portrait',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_3',
    title: 'Studio Lighting',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_4',
    title: 'Radiant Glow',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_5',
    title: 'Gentle Expression',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_6',
    title: 'Golden Hour Smile',
    category: 'Portraits',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  },

  // Outdoor
  {
    id: 'cur_7',
    title: 'Mountain Hike',
    category: 'Outdoor',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_8',
    title: 'Park Afternoon',
    category: 'Outdoor',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_9',
    title: 'Beach Horizon',
    category: 'Outdoor',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_10',
    title: 'Forest Trail Walk',
    category: 'Outdoor',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
  },

  // Cozy & Casual
  {
    id: 'cur_11',
    title: 'Coffee House Vibe',
    category: 'Cozy',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_12',
    title: 'Casual Sweater Day',
    category: 'Cozy',
    url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_13',
    title: 'Bookstore Stroll',
    category: 'Cozy',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
  },

  // Style & Urban
  {
    id: 'cur_14',
    title: 'City Street Style',
    category: 'Style',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_15',
    title: 'Modern Architecture',
    category: 'Style',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_16',
    title: 'Evening Sunset Light',
    category: 'Style',
    url: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&w=800&q=80'
  },

  // Active & Fitness
  {
    id: 'cur_17',
    title: 'Morning Runner',
    category: 'Active',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cur_18',
    title: 'Yoga Practice',
    category: 'Active',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  }
];
