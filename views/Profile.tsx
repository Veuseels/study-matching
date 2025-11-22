import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Link as LinkIcon, Calendar, BookOpen, Clock, Users, Edit3, ChevronRight, Camera, Upload } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, setView, updateUser } = useApp();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState(user);

    const handleSave = () => {
        if (editForm && user) {
            updateUser(editForm);
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editForm) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => prev ? { ...prev, avatar: reader.result as string } : prev);
            };
            reader.readAsDataURL(file);
        }
    };

    // Ensure editForm stays in sync with user if user changes
    React.useEffect(() => {
        if (user && !isEditing) {
            setEditForm(user);
        }
    }, [user, isEditing]);

    return (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            {/* Cover Image */}
            <div className="h-48 bg-black relative mb-16 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute -bottom-12 left-8 flex items-end">
                    <div className="w-32 h-32 bg-yellow-300 border-4 border-black flex items-center justify-center text-4xl font-black overflow-hidden relative group">
                        {editForm?.avatar ? (
                            <img src={editForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.name[0]}</span>
                        )}

                        {isEditing && (
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                                <Camera className="text-white mb-1" size={24} />
                                <span className="text-white text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute bottom-4 right-4 bg-white border-2 border-black px-4 py-2 font-bold flex items-center gap-2 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                >
                    <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                    <h2 className="text-2xl font-black uppercase mb-6">Edit Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={editForm.age}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Current School</label>
                            <input
                                name="currentSchool"
                                value={editForm.currentSchool}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Dream School</label>
                            <input
                                name="dreamSchool"
                                value={editForm.dreamSchool}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Major</label>
                            <input
                                name="major"
                                value={editForm.major}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Study Interests</label>
                            <input
                                name="studyInterest"
                                value={editForm.studyInterest}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Preferred Time</label>
                            <select
                                name="preferredTimeframe"
                                value={editForm.preferredTimeframe}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2"
                            >
                                <option value="Early mornings">Early mornings</option>
                                <option value="Weekday mornings">Weekday mornings</option>
                                <option value="Afternoons">Afternoons</option>
                                <option value="Evenings">Evenings</option>
                                <option value="Weeknights">Weeknights</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-bold mb-1 text-xs uppercase">Bio</label>
                            <textarea
                                name="bio"
                                value={editForm.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border-2 border-black p-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleSave}
                                className="bg-black text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-gray-800"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div>
                            <h1 className="text-3xl font-black uppercase leading-none mb-2">{user.name}</h1>
                            <p className="text-lg font-bold text-gray-600">@{user.name.toLowerCase().replace(' ', '')}</p>
                            <p className="text-md font-bold text-gray-500 mt-1">{user.age} years old</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={20} />
                                <span className="font-medium">{user.currentSchool}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <LinkIcon size={20} />
                                <a href="#" className="font-medium hover:underline text-blue-600">portfolio.site</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={20} />
                                <span className="font-medium">Joined September 2024</span>
                            </div>
                        </div>

                        <div className="border-4 border-black p-4 bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black uppercase flex items-center gap-2">
                                    <Users size={20} /> Friends
                                </h3>
                                <span className="bg-black text-white px-2 py-0.5 text-sm font-bold rounded-full">
                                    {user.friends.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {/* Show first 8 friends or placeholders */}
                                {[...Array(Math.min(8, Math.max(4, user.friends.length)))].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 border-2 border-black rounded-sm flex items-center justify-center text-xs font-bold">
                                        {user.friends[i] ? user.friends[i][0] : ''}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setView('friends')}
                                className="w-full py-2 font-bold border-2 border-black hover:bg-white transition-colors flex items-center justify-center gap-1"
                            >
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Bio */}
                        <section className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm rounded-full">01</span>
                                About Me
                            </h2>
                            <p className="text-lg font-medium leading-relaxed">
                                {user.bio}
                            </p>
                        </section>

                        {/* Academic Profile */}
                        <section className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm rounded-full">02</span>
                                Academic Profile
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-yellow-50 p-4 border-2 border-black">
                                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold uppercase text-xs">
                                        <BookOpen size={16} /> Study Interests
                                    </div>
                                    <div className="font-black text-lg">{user.studyInterest}</div>
                                </div>

                                <div className="bg-blue-50 p-4 border-2 border-black">
                                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold uppercase text-xs">
                                        <GraduationCap size={16} /> Major
                                    </div>
                                    <div className="font-black text-lg">{user.major}</div>
                                </div>

                                <div className="bg-green-50 p-4 border-2 border-black">
                                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold uppercase text-xs">
                                        <GraduationCap size={16} /> Dream School
                                    </div>
                                    <div className="font-black text-lg">{user.dreamSchool}</div>
                                </div>

                                <div className="bg-purple-50 p-4 border-2 border-black">
                                    <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold uppercase text-xs">
                                        <Clock size={16} /> Preferred Time
                                    </div>
                                    <div className="font-black text-lg">{user.preferredTimeframe}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper for icon
const GraduationCap = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 0 6-1 6-1v-7" />
    </svg>
);

export default Profile;