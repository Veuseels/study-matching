import { User, GroupChat, PrivateChat, Profile } from './types';

export const DEFAULT_USER: User = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  age: 20,
  currentSchool: 'Stanford University',
  dreamSchool: 'MIT',
  major: 'Computer Science',
  studyInterest: 'Programming, English literature',
  preferredTimeframe: 'Evenings and weekends',
  bio: 'Passionate about coding and literature. Looking for study partners!',
  friends: ['Alice Writer', 'Bob Coder', 'Charlie Fullstack'],
  avatar: '',
  joinedDate: new Date('2024-01-15').toISOString()
};

export const PROFILES: Profile[] = [
  { name: 'Sarah Chen', age: 20, currentSchool: 'Stanford University', dreamSchool: 'MIT', major: 'Computer Science', studyInterest: 'AI fundamentals', preferredTimeframe: 'Weekday mornings' },
  { name: 'Mike Johnson', age: 22, currentSchool: 'MIT', dreamSchool: 'Harvard Business School', major: 'Mathematics', studyInterest: 'Probability theory', preferredTimeframe: 'Afternoons' },
  { name: 'Emily Rodriguez', age: 21, currentSchool: 'Harvard University', dreamSchool: 'Stanford University', major: 'Biology', studyInterest: 'Genetics', preferredTimeframe: 'Weekends' },
  { name: 'David Kim', age: 23, currentSchool: 'Stanford University', dreamSchool: 'Caltech', major: 'Physics', studyInterest: 'Quantum computing', preferredTimeframe: 'Evenings' },
  { name: 'Lisa Wang', age: 20, currentSchool: 'Yale University', dreamSchool: 'Wharton', major: 'Business', studyInterest: 'Market analysis', preferredTimeframe: 'Early mornings' },
  { name: 'Alex Turner', age: 22, currentSchool: 'MIT', dreamSchool: 'Stanford University', major: 'Engineering', studyInterest: 'Robotics', preferredTimeframe: 'Flexible' },
  { name: 'Maya Patel', age: 21, currentSchool: 'Princeton', dreamSchool: 'Columbia University', major: 'Psychology', studyInterest: 'Behavioral research', preferredTimeframe: 'Weeknights' },
  { name: 'Chris Lee', age: 24, currentSchool: 'Stanford University', dreamSchool: 'Oxford University', major: 'Chemistry', studyInterest: 'Organic synthesis', preferredTimeframe: 'Afternoons' },
  { name: 'Alice Writer', age: 21, currentSchool: 'Columbia University', dreamSchool: 'Oxford', major: 'English', studyInterest: 'English literature', preferredTimeframe: 'Weekends' },
  { name: 'Bob Coder', age: 22, currentSchool: 'MIT', dreamSchool: 'Stanford', major: 'Computer Science', studyInterest: 'Programming', preferredTimeframe: 'Late nights' },
  { name: 'Charlie Fullstack', age: 23, currentSchool: 'Berkeley', dreamSchool: 'MIT', major: 'EECS', studyInterest: 'Programming, AI', preferredTimeframe: 'Flexible' },
  // New NPCs for testing
  { name: 'Diana Martinez', age: 20, currentSchool: 'Stanford University', dreamSchool: 'Harvard', major: 'Computer Science', studyInterest: 'Programming, AI', preferredTimeframe: 'Evenings and weekends' },
  { name: 'Ethan Brown', age: 22, currentSchool: 'Oxford University', dreamSchool: 'Stanford', major: 'Philosophy', studyInterest: 'English literature', preferredTimeframe: 'Mornings' },
  { name: 'Fiona Zhang', age: 21, currentSchool: 'MIT', dreamSchool: 'MIT', major: 'Computer Science', studyInterest: 'Programming, Algorithms', preferredTimeframe: 'Evenings' },
  { name: 'Gabriel Santos', age: 23, currentSchool: 'Harvard', dreamSchool: 'MIT', major: 'Economics', studyInterest: 'Market analysis, Statistics', preferredTimeframe: 'Afternoons' },
  { name: 'Hannah Lee', age: 20, currentSchool: 'Yale', dreamSchool: 'Columbia', major: 'English', studyInterest: 'English literature, Poetry', preferredTimeframe: 'Weekends' },
  { name: 'Isaac Chen', age: 24, currentSchool: 'Stanford University', dreamSchool: 'Oxford University', major: 'Computer Science', studyInterest: 'Programming, Machine Learning', preferredTimeframe: 'Evenings and weekends' },
  { name: 'Julia Park', age: 21, currentSchool: 'Princeton', dreamSchool: 'Stanford', major: 'Computer Science', studyInterest: 'Programming, Web dev', preferredTimeframe: 'Flexible' },
  { name: 'Kevin Nguyen', age: 22, currentSchool: 'Berkeley', dreamSchool: 'MIT', major: 'Engineering', studyInterest: 'Robotics, AI', preferredTimeframe: 'Late nights' },
  { name: 'Laura Wilson', age: 20, currentSchool: 'Columbia', dreamSchool: 'Harvard', major: 'Literature', studyInterest: 'English literature, Creative writing', preferredTimeframe: 'Weekends' },
  { name: 'Marcus Taylor', age: 23, currentSchool: 'MIT', dreamSchool: 'Stanford University', major: 'Computer Science', studyInterest: 'Programming, Data science', preferredTimeframe: 'Evenings' },
  { name: 'Nina Patel', age: 21, currentSchool: 'Stanford University', dreamSchool: 'Oxford', major: 'Computer Science', studyInterest: 'Programming, Software engineering', preferredTimeframe: 'Evenings and weekends' },
  { name: 'Oliver James', age: 22, currentSchool: 'Harvard', dreamSchool: 'MIT', major: 'Mathematics', studyInterest: 'Calculus, Programming', preferredTimeframe: 'Mornings' },
  { name: 'Priya Sharma', age: 20, currentSchool: 'Yale', dreamSchool: 'Stanford', major: 'Biology', studyInterest: 'Genetics, Research', preferredTimeframe: 'Afternoons' },
  { name: 'Quinn Rodriguez', age: 24, currentSchool: 'Oxford University', dreamSchool: 'Cambridge', major: 'English', studyInterest: 'English literature, Linguistics', preferredTimeframe: 'Flexible' },
  { name: 'Rachel Kim', age: 21, currentSchool: 'Stanford University', dreamSchool: 'MIT', major: 'Computer Science', studyInterest: 'Programming, AI, Machine Learning', preferredTimeframe: 'Evenings and weekends' },
  { name: 'Sam Torres', age: 23, currentSchool: 'MIT', dreamSchool: 'Stanford', major: 'Data Science', studyInterest: 'Data analysis, ML, Statistics', preferredTimeframe: 'Evenings' },
  { name: 'Tina Wu', age: 22, currentSchool: 'Berkeley', dreamSchool: 'MIT', major: 'Engineering', studyInterest: 'Robotics, Automation, AI', preferredTimeframe: 'Flexible' },
  { name: 'Uma Patel', age: 20, currentSchool: 'Columbia', dreamSchool: 'Harvard', major: 'Psychology', studyInterest: 'Behavioral science, Cognitive science', preferredTimeframe: 'Mornings' },
  { name: 'Victor Chen', age: 21, currentSchool: 'Princeton', dreamSchool: 'Stanford', major: 'Philosophy', studyInterest: 'Ethics, Critical thinking, Logic', preferredTimeframe: 'Afternoons' },
  { name: 'Wendy Liu', age: 24, currentSchool: 'Yale', dreamSchool: 'Oxford', major: 'Art', studyInterest: 'Painting, Design, Visual arts', preferredTimeframe: 'Weekends' },
  { name: 'Xavier Johnson', age: 22, currentSchool: 'Harvard', dreamSchool: 'MIT', major: 'Economics', studyInterest: 'Business, Finance, Market analysis', preferredTimeframe: 'Evenings' },
  { name: 'Yara Hassan', age: 21, currentSchool: 'Stanford University', dreamSchool: 'MIT', major: 'Computer Science', studyInterest: 'Web development, Frontend, Fullstack', preferredTimeframe: 'Flexible' },
  { name: 'Zoe Martinez', age: 20, currentSchool: 'MIT', dreamSchool: 'Stanford', major: 'Physics', studyInterest: 'Quantum physics, Astrophysics', preferredTimeframe: 'Late nights' },
  { name: 'Adam Brown', age: 23, currentSchool: 'Berkeley', dreamSchool: 'MIT', major: 'Chemistry', studyInterest: 'Organic chemistry, Biochemistry', preferredTimeframe: 'Mornings' },
  { name: 'Bella Singh', age: 22, currentSchool: 'Oxford', dreamSchool: 'Cambridge', major: 'History', studyInterest: 'World history, Ancient history', preferredTimeframe: 'Afternoons' },
  { name: 'Carlos Rivera', age: 21, currentSchool: 'Columbia', dreamSchool: 'Harvard', major: 'Music', studyInterest: 'Composition, Performance, Theory', preferredTimeframe: 'Evenings' },
  { name: 'Diana Lee', age: 24, currentSchool: 'Yale', dreamSchool: 'Stanford', major: 'Computer Science', studyInterest: 'Software engineering, Development, Coding', preferredTimeframe: 'Flexible' }
];

export const INITIAL_GROUP_CHATS: GroupChat[] = [];

export const INITIAL_PRIVATE_CHATS: PrivateChat[] = [];