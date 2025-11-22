import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, MessageCircle, User, LogOut, Search, Users } from 'lucide-react';

const Header: React.FC = () => {
  const { view, setView, logout, user, profiles } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof profiles>([]);

  // Search effect
  React.useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const results = profiles.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.studyInterest.toLowerCase().includes(query) ||
        p.currentSchool.toLowerCase().includes(query) ||
        p.dreamSchool.toLowerCase().includes(query) ||
        p.major.toLowerCase().includes(query)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, profiles]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'match', label: 'Match' },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'groupchats', label: 'Groups' },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <header className="border-b-4 border-black sticky top-0 bg-white z-50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setView('home')}>
          <div className="bg-black text-white p-1.5 rounded">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase hidden sm:block">EduConnect</h1>
        </div>

        {/* Search Bar - Extended */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name, interests, school, major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
          />

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black rounded-lg shadow-lg max-h-96 overflow-y-auto z-[100]">
              {searchResults.map(profile => (
                <div
                  key={profile.name}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b-2 border-gray-200 last:border-0"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <div className="font-bold">{profile.name}</div>
                  <div className="text-sm text-gray-600">{profile.major} • {profile.currentSchool}</div>
                  <div className="text-xs text-gray-500">{profile.studyInterest}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`px-3 py-1.5 font-bold uppercase text-sm border-2 transition-all ${view === item.id
                ? 'bg-black text-white border-black translate-y-0.5 shadow-none'
                : 'bg-white text-black border-transparent hover:border-black hover:bg-yellow-100'
                }`}
            >
              {item.label}
            </button>
          ))}

          <div className="relative ml-2" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
            <button
              onClick={() => setView('profile')}
              className={`p-1.5 border-2 rounded-full transition-all ${view === 'profile'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black hover:bg-yellow-100'
                }`}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User size={20} strokeWidth={2.5} />
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full pt-2 w-48">
                <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex flex-col gap-2">
                  <button
                    onClick={() => setView('profile')}
                    className="text-left px-4 py-2 font-bold hover:bg-yellow-100 border-2 border-transparent hover:border-black transition-all"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-left px-4 py-2 font-bold text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-600 transition-all"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;