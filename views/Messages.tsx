import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Plus, X, Send, Phone, Video, Paperclip } from 'lucide-react';

const Messages: React.FC = () => {
    const { privateChats, startPrivateChat, sendPrivateMessage, profiles, user } = useApp();
    const [activeFriend, setActiveFriend] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = privateChats.find(c => c.friend === activeFriend);
    const sortedChats = [...privateChats].sort((a, b) => b.lastActivity - a.lastActivity);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeChat?.messages]);

    const handleSendMessage = () => {
        if (activeFriend && inputText.trim()) {
            sendPrivateMessage(activeFriend, inputText.trim());
            setInputText('');
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1400px] h-[800px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-full">

                {/* List */}
                <div className="border-4 border-black rounded-xl p-6 h-full flex flex-col bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Messages</h2>
                        <button onClick={() => setShowNewChatModal(true)} className="p-2 bg-black text-white rounded-lg hover:bg-gray-800">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {sortedChats.map(chat => (
                            <div
                                key={chat.friend}
                                onClick={() => setActiveFriend(chat.friend)}
                                className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${activeFriend === chat.friend
                                    ? 'bg-black text-white border-black'
                                    : 'border-black hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden ${activeFriend === chat.friend ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {profiles.find(p => p.name === chat.friend)?.avatar ? (
                                        <img src={profiles.find(p => p.name === chat.friend)?.avatar} alt={chat.friend} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(chat.friend)
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold truncate">{chat.friend}</h4>
                                    <p className={`text-xs truncate ${activeFriend === chat.friend ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="border-4 border-black rounded-xl p-6 h-full flex flex-col bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {activeChat ? (
                        <>
                            <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-100 mb-4">
                                <div className="w-12 h-12 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black text-lg">
                                    {activeChat.friend[0]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{activeChat.friend}</h3>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => alert(`Calling ${activeChat.friend}...`)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Voice Call"
                                    >
                                        <Phone size={20} />
                                    </button>
                                    <button
                                        onClick={() => alert(`Starting video call with ${activeChat.friend}...`)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Video Call"
                                    >
                                        <Video size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-100">
                                {activeChat.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.me ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-xl border-2 shadow-sm ${msg.me
                                            ? 'bg-black text-white border-black rounded-br-none'
                                            : 'bg-white text-black border-black rounded-bl-none'
                                            }`}>
                                            <p>{msg.text}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1 px-1">
                                            {msg.time}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t-2 border-gray-100 pt-4">
                                <div className="flex gap-3">
                                    <label className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Attach File">
                                        <Paperclip size={20} />
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) alert(`File "${file.name}" selected. Upload feature coming soon!`);
                                            }}
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-black text-white px-6 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="text-6xl mb-4">✉️</div>
                            <p className="text-xl">Select a friend to message</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">New Message</h3>
                            <button onClick={() => setShowNewChatModal(false)}><X /></button>
                        </div>
                        <div>
                            <label className="block font-bold mb-2 text-sm uppercase">Select a Friend</label>
                            <div className="max-h-[300px] overflow-y-auto border-2 border-gray-200 rounded-lg p-2 space-y-1">
                                {user && profiles.filter(p => user.friends.includes(p.name)).map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => {
                                            startPrivateChat(p.name);
                                            setActiveFriend(p.name);
                                            setShowNewChatModal(false);
                                        }}
                                        className="w-full text-left p-3 hover:bg-gray-50 rounded font-bold border-2 border-transparent hover:border-black transition-all"
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;