import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { User, ViewState, GroupChat, PrivateChat, Message, Profile, AIMessage } from '../types';
import { DEFAULT_USER, PROFILES, INITIAL_GROUP_CHATS, INITIAL_PRIVATE_CHATS } from '../constants';
import { sendMessageToAI } from '../utils/openai';

interface AppContextType {
  user: User | null; // User is null when not logged in
  updateUser: (user: User) => void;
  view: ViewState;
  setView: (view: ViewState) => void;
  profiles: Profile[];
  likedProfiles: Profile[];
  likeProfile: (profile: Profile) => void;
  groupChats: GroupChat[];
  createGroupChat: (name: string, members: string[]) => void;
  updateGroupChat: (id: number, messages: Message[]) => void;
  renameGroupChat: (id: number, name: string) => void;
  leaveGroupChat: (id: number) => void;
  privateChats: PrivateChat[];
  startPrivateChat: (friendName: string) => void;
  sendPrivateMessage: (friendName: string, text: string) => void;
  login: (email: string, password: string) => boolean;
  signup: (user: User) => boolean;
  logout: () => void;
  addFriend: (friendName: string) => void;
  removeFriend: (friendName: string) => void;
  aiMessages: AIMessage[];
  sendAIMessage: (message: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from localStorage if available, otherwise null (logged out)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [view, setView] = useState<ViewState>('home');
  const [profiles] = useState<Profile[]>(PROFILES);
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(INITIAL_GROUP_CHATS);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>(INITIAL_PRIVATE_CHATS);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([]);

  // Persist current user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Also update the user in the "database" (users array in localStorage)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUsers = users.map((u: User) => u.email === updatedUser.email ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const likeProfile = (profile: Profile) => {
    if (!likedProfiles.find(p => p.name === profile.name)) {
      setLikedProfiles([...likedProfiles, profile]);
    }
  };

  const createGroupChat = (name: string, members: string[]) => {
    const newChat: GroupChat = {
      id: Date.now(),
      name,
      members: [...members, 'You'],
      messages: []
    };
    setGroupChats([newChat, ...groupChats]);
  };

  const updateGroupChat = (id: number, messages: Message[]) => {
    setGroupChats(prev => prev.map(chat => chat.id === id ? { ...chat, messages } : chat));
  };

  const renameGroupChat = (id: number, name: string) => {
    setGroupChats(prev => prev.map(chat => chat.id === id ? { ...chat, name } : chat));
  };

  const leaveGroupChat = (id: number) => {
    setGroupChats(prev => prev.filter(chat => chat.id !== id));
  };

  const startPrivateChat = (friendName: string) => {
    if (!privateChats.find(c => c.friend === friendName)) {
      const newChat: PrivateChat = {
        friend: friendName,
        lastActivity: Date.now(),
        messages: []
      };
      setPrivateChats([newChat, ...privateChats]);
    }
    setView('messages');
  };

  const sendPrivateMessage = (friendName: string, text: string) => {
    setPrivateChats(prev => {
      const chatIndex = prev.findIndex(c => c.friend === friendName);
      if (chatIndex === -1) return prev;

      const updatedChat = { ...prev[chatIndex] };
      updatedChat.messages = [...updatedChat.messages, {
        from: 'You',
        text,
        time: 'Now',
        timestamp: Date.now(),
        me: true
      }];
      updatedChat.lastActivity = Date.now();

      const newChats = [...prev];
      newChats[chatIndex] = updatedChat;
      return newChats.sort((a, b) => b.lastActivity - a.lastActivity);
    });
  };

  // Auth Logic
  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    // Check demo account
    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      setUser(DEFAULT_USER);
      localStorage.setItem('currentUser', JSON.stringify(DEFAULT_USER));
      if (!users.find((u: User) => u.email === DEFAULT_USER.email)) {
        localStorage.setItem('users', JSON.stringify([...users, DEFAULT_USER]));
      }
      return true;
    }

    // Check if user exists in database
    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    return false;
  };

  const signup = (userData: User): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: User) => u.email === userData.email)) {
      return false; // User already exists
    }

    const newUser = {
      ...userData,
      joinedDate: new Date().toISOString(), // Set joined date
      friends: userData.friends || []
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUser(newUser);
    setView('home');
    return true;
  };

  const logout = () => {
    setUser(null);
    setView('home'); // Will redirect to login view in UI
  };

  const addFriend = (friendName: string) => {
    if (user && !user.friends.includes(friendName)) {
      const updatedUser = { ...user, friends: [...user.friends, friendName] };
      updateUser(updatedUser);
    }
  };

  const removeFriend = (friendName: string) => {
    if (user && user.friends.includes(friendName)) {
      const updatedUser = { ...user, friends: user.friends.filter(f => f !== friendName) };
      updateUser(updatedUser);
    }
  };

  const sendAIMessage = async (message: string): Promise<void> => {
    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setAIMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessageToAI(
        [...aiMessages, userMessage].map(m => ({ role: m.role, content: m.content }))
      );

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setAIMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Remove the user message if the API call failed
      setAIMessages(prev => prev.filter(m => m.timestamp !== userMessage.timestamp));
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      user, updateUser,
      view, setView,
      profiles, likedProfiles, likeProfile,
      groupChats, createGroupChat, updateGroupChat, renameGroupChat, leaveGroupChat,
      privateChats, startPrivateChat, sendPrivateMessage,
      login, signup, logout, addFriend, removeFriend,
      aiMessages, sendAIMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};