// Sports catalog — indoor & outdoor
export type SportType = 'indoor' | 'outdoor';

export interface Sport {
  id: string;
  name: string;
  type: SportType;
  icon: string; // emoji
}

export const SPORTS: Sport[] = [
  // Indoor
  { id: 'badminton', name: 'Badminton', type: 'indoor', icon: '🏸' },
  { id: 'table_tennis', name: 'Table Tennis', type: 'indoor', icon: '🏓' },
  { id: 'chess', name: 'Chess', type: 'indoor', icon: '♟️' },
  { id: 'carrom', name: 'Carrom', type: 'indoor', icon: '🎯' },
  { id: 'basketball_i', name: 'Basketball', type: 'indoor', icon: '🏀' },
  { id: 'volleyball_i', name: 'Volleyball', type: 'indoor', icon: '🏐' },
  { id: 'boxing', name: 'Boxing', type: 'indoor', icon: '🥊' },
  { id: 'squash', name: 'Squash', type: 'indoor', icon: '🎾' },
  { id: 'wrestling', name: 'Wrestling', type: 'indoor', icon: '🤼' },
  { id: 'taekwondo', name: 'Taekwondo', type: 'indoor', icon: '🥋' },
  // Outdoor
  { id: 'cricket', name: 'Cricket', type: 'outdoor', icon: '🏏' },
  { id: 'football', name: 'Football', type: 'outdoor', icon: '⚽' },
  { id: 'rugby', name: 'Rugby', type: 'outdoor', icon: '🏉' },
  { id: 'tennis', name: 'Tennis', type: 'outdoor', icon: '🎾' },
  { id: 'athletics', name: 'Athletics', type: 'outdoor', icon: '🏃' },
  { id: 'swimming', name: 'Swimming', type: 'outdoor', icon: '🏊' },
  { id: 'cycling', name: 'Cycling', type: 'outdoor', icon: '🚴' },
  { id: 'archery', name: 'Archery', type: 'outdoor', icon: '🏹' },
  { id: 'hockey', name: 'Hockey', type: 'outdoor', icon: '🏑' },
  { id: 'volleyball_o', name: 'Beach Volleyball', type: 'outdoor', icon: '🏐' },
];

export type GameCategory = 'faculty' | 'inter_university' | 'inter_faculty' | 'slug';

export const CATEGORIES: { id: GameCategory; label: string; icon: string; color: string }[] = [
  { id: 'faculty', label: 'Faculty Games', icon: '🏫', color: '#4F46E5' },
  { id: 'inter_university', label: 'Inter University', icon: '🏛️', color: '#059669' },
  { id: 'inter_faculty', label: 'Inter Faculty', icon: '🤝', color: '#D97706' },
  { id: 'slug', label: 'Slug', icon: '🎮', color: '#DC2626' },
];
