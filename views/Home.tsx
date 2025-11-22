import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Users, MessageCircle, X, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { user, profiles, setView, startPrivateChat, logout } = useApp();
  const [selectedFriend, setSelectedFriend] = React.useState<string | null>(null);

  // Safety check - verify user has required properties
  if (!user || !user.name || !user.friends) {
    // If user data is corrupted, log them out to clear bad data
    if (user) {
      logout();
    }
    return <div className="container mx-auto px-6 py-8">Loading...</div>;
  }

  const friendProfiles = profiles.filter(p => user.friends.includes(p.name));
  const selectedProfile = profiles.find(p => p.name === selectedFriend);

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="container mx-auto px-6 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-gray-600">Find study partners and grow together</p>
      </div>

      <div className="bg-black text-white border-4 border-black rounded-xl p-12 text-center mb-8 shadow-xl">
        <div className="text-5xl mb-4 flex justify-center"><BookOpen size={64} /></div>
        <h2 className="text-2xl font-bold mb-3">Find Your Study Partner</h2>
        <p className="text-gray-300 mb-6">Swipe through profiles and connect with peers</p>
        <button
          onClick={() => setView('match')}
          className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          Start Matching <ArrowRight size={20} />
        </button>
      </div>

      <div className="mb-8">
        <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <Users size={24} />
              Friends ({user.friends.length})
            </h3>
            <button
              onClick={() => setView('friends')}
              className="px-4 py-2 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded"
            >
              View All
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {friendProfiles.slice(0, 6).map(friend => (
              <div
                key={friend.name}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setSelectedFriend(friend.name)}
              >
                <div className="w-16 h-16 bg-yellow-300 border-2 border-black rounded-full flex items-center justify-center font-black text-lg overflow-hidden">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    friend.name[0]
                  )}
                </div>
                <span className="text-xs font-bold text-center max-w-[64px] truncate">{friend.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Friend Profile Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4" onClick={() => setSelectedFriend(null)}>
            <div className="bg-white border-4 border-black rounded-xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">{selectedProfile.name}</h2>
                <button onClick={() => setSelectedFriend(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Age</span>
                  <p className="text-lg font-bold">{selectedProfile.age} years old</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Joined</span>
                  <p className="text-lg font-bold">{formatJoinedDate(selectedProfile.joinedDate)}</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Current School</span>
                  <p className="text-lg font-bold">{selectedProfile.currentSchool}</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Dream School</span>
                  <p className="text-lg font-bold">{selectedProfile.dreamSchool}</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Major</span>
                  <p className="text-lg font-bold">{selectedProfile.major}</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Study Interests</span>
                  <p className="text-lg font-bold">{selectedProfile.studyInterest}</p>
                </div>

                <div>
                  <span className="text-xs font-black uppercase text-gray-500">Availability</span>
                  <p className="text-lg font-bold">{selectedProfile.preferredTimeframe}</p>
                </div>

                <button
                  onClick={() => {
                    startPrivateChat(selectedProfile.name);
                    setView('messages');
                    setSelectedFriend(null);
                  }}
                  className="w-full mt-6 py-3 bg-black text-white font-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;