export interface User {
  name: string;
  email: string;
  password?: string;
  age: number;
  currentSchool: string;
  dreamSchool: string;
  major: string;
  studyInterest: string;
  preferredTimeframe: string;
  bio?: string;
  avatar?: string; // Base64 data URL
  friends: string[]; // List of friend names
  joinedDate?: string; // ISO date string
}

export interface Profile {
  name: string;
  age: number;
  currentSchool: string;
  dreamSchool: string;
  major: string;
  studyInterest: string;
  preferredTimeframe: string;
  avatar?: string;
}

export interface Message {
  from: string;
  text?: string;
  image?: string;
  time: string;
  timestamp: number;
  me: boolean;
}

export interface GroupChat {
  id: number;
  name: string;
  members: string[];
  messages: Message[];
}

export interface PrivateChat {
  friend: string;
  lastActivity: number;
  messages: Message[];
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type ViewState = 'home' | 'match' | 'groupchats' | 'messages' | 'profile' | 'friends' | 'aiassistant';