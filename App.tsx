import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Home from './views/Home';
import Match from './views/Match';
import GroupChats from './views/GroupChats';
import Messages from './views/Messages';
import Profile from './views/Profile';
import Login from './views/Login';
import Signup from './views/Signup';
import Friends from './views/Friends';
import AIAssistant from './views/AIAssistant';

const App: React.FC = () => {
  const { view, user } = useApp();
  const [isSignup, setIsSignup] = useState(false);

  if (!user) {
    return isSignup ? (
      <Signup onSwitchToLogin={() => setIsSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setIsSignup(true)} />
    );
  }

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'match': return <Match />;
      case 'groupchats': return <GroupChats />;
      case 'messages': return <Messages />;
      case 'profile': return <Profile />;
      case 'friends': return <Friends />;
      case 'aiassistant': return <AIAssistant />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;