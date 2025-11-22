import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import DrawingCanvas from '../components/DrawingCanvas';
import { Plus, MoreVertical, LogOut, Edit2, Send, X, Paperclip } from 'lucide-react';
import { GroupChat } from '../types';

const GroupChats: React.FC = () => {
    const { groupChats, profiles, createGroupChat, updateGroupChat, renameGroupChat, leaveGroupChat, user } = useApp();
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);

    // Message Input
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Create Group Form
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Rename
    const [renameText, setRenameText] = useState('');

    const activeChat = groupChats.find(c => c.id === activeChatId);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeChat?.messages]);

    const handleSendMessage = () => {
        if (!activeChat || !inputText.trim()) return;

        const newMessage = {
            from: 'You',
            text: inputText.trim(),
            time: 'Now',
            timestamp: Date.now(),
            me: true
        };

        updateGroupChat(activeChat.id, [...activeChat.messages, newMessage]);
        setInputText('');
    };

    const handleSendDrawing = (dataUrl: string) => {
        if (!activeChat) return;
        const newMessage = {
            from: 'You',
            image: dataUrl,
            time: 'Now',
            timestamp: Date.now(),
            me: true
        };
        updateGroupChat(activeChat.id, [...activeChat.messages, newMessage]);
    };

    const handleCreateGroup = () => {
        if (!newGroupName || selectedMembers.length === 0) return;
        createGroupChat(newGroupName, selectedMembers);
        setShowCreateModal(false);
        setNewGroupName('');
        setSelectedMembers([]);
    };

    const handleRename = () => {
        if (activeChat && renameText) {
            renameGroupChat(activeChat.id, renameText);
            setShowRenameModal(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1400px] h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 h-full">

                {/* List Column */}
                <div className="border-4 border-black rounded-xl p-6 h-full flex flex-col bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Groups</h2>
                        <button onClick={() => setShowCreateModal(true)} className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {groupChats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${activeChatId === chat.id
                                    ? 'bg-black text-white border-black'
                                    : 'border-black hover:bg-gray-50'
                                    }`}
                            >
                                <h4 className="font-bold text-lg truncate">{chat.name}</h4>
                                <p className={`text-sm ${activeChatId === chat.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {chat.members.length} members
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="border-4 border-black rounded-xl p-6 h-full flex flex-col bg-white relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {activeChat ? (
                        <>
                            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100 mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        {activeChat.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">{activeChat.members.join(', ')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setRenameText(activeChat.name); setShowRenameModal(true); }}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Rename"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Leave group?')) {
                                                leaveGroupChat(activeChat.id);
                                                setActiveChatId(null);
                                            }
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded" title="Leave"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
                                {activeChat.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.me ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-xl border-2 ${msg.me
                                            ? 'bg-black text-white border-black rounded-br-none'
                                            : 'bg-white text-black border-black rounded-bl-none'
                                            }`}>
                                            {msg.image ? (
                                                <img src={msg.image} alt="Drawing" className="w-full rounded bg-white" />
                                            ) : (
                                                <p>{msg.text}</p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">
                                            {msg.from} · {msg.time}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Drawing Canvas & Input */}
                            <div className="border-t-2 border-gray-100 pt-4">
                                <div className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Canvas</div>
                                <DrawingCanvas onSend={handleSendDrawing} />

                                <div className="flex gap-3 mt-4">
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
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-xl">Select a group to start chatting</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create New Group</h3>
                            <button onClick={() => setShowCreateModal(false)}><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold mb-2">Group Name</label>
                                <input
                                    className="w-full p-3 border-2 border-black rounded-lg"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="e.g. Math Study Squad"
                                />
                            </div>
                            <div>
                                <label className="block font-bold mb-2">Select Friends</label>
                                <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-lg p-2 space-y-1">
                                    {profiles.filter(p => user.friends.includes(p.name)).map(p => (
                                        <label key={p.name} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(p.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedMembers([...selectedMembers, p.name]);
                                                    else setSelectedMembers(selectedMembers.filter(m => m !== p.name));
                                                }}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <span>{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleCreateGroup}
                                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Modal */}
            {showRenameModal && (
                <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-black rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Rename Group</h3>
                            <button onClick={() => setShowRenameModal(false)}><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold mb-2">New Name</label>
                                <input
                                    className="w-full p-3 border-2 border-black rounded-lg"
                                    value={renameText}
                                    onChange={(e) => setRenameText(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleRename}
                                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChats;