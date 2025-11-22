import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, UserMinus, X } from 'lucide-react';

const Friends: React.FC = () => {
    const { user, profiles, startPrivateChat, removeFriend } = useApp();
    const [selectedFriend, setSelectedFriend] = React.useState<string | null>(null);

    const selectedProfile = profiles.find(p => p.name === selectedFriend);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-4xl font-black uppercase mb-8 tracking-tighter">My Friends ({user.friends.length})</h2>

            {user.friends.length === 0 ? (
                <div className="text-center py-12 border-4 border-dashed border-gray-300 rounded-lg">
                    <p className="text-xl font-bold text-gray-500">You haven't added any friends yet.</p>
                    <p className="mt-2">Go to the Match page to find study partners!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.friends.map((friendName) => (
                        <div
                            key={friendName}
                            className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            onClick={() => setSelectedFriend(friendName)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-300 border-2 border-black rounded-full flex items-center justify-center font-black text-lg">
                                    {friendName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{friendName}</h3>
                                    <p className="text-sm text-gray-600">Study Partner</p>
                                </div>
                            </div>

                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => startPrivateChat(friendName)}
                                    className="p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                                    title="Message"
                                >
                                    <MessageCircle size={20} />
                                </button>
                                <button
                                    onClick={() => removeFriend(friendName)}
                                    className="p-2 border-2 border-black rounded hover:bg-red-50 text-red-600 transition-colors"
                                    title="Remove Friend"
                                >
                                    <UserMinus size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                                    removeFriend(selectedProfile.name);
                                    setSelectedFriend(null);
                                }}
                                className="w-full mt-6 py-3 bg-red-500 text-white font-black rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Remove Friend
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Friends;
