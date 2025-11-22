import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { UserPlus } from 'lucide-react';

const Signup: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
    const { signup } = useApp();
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        password: '',
        age: '',
        currentSchool: '',
        dreamSchool: '',
        major: '',
        studyInterest: '',
        preferredTimeframe: '',
        bio: '',
        friends: []
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Comprehensive validation
        if (!formData.name || !formData.email || !formData.password ||
            !formData.currentSchool || !formData.dreamSchool || !formData.major || !formData.studyInterest ||
            !formData.preferredTimeframe || !formData.bio) {
            setError('Please fill in all fields or select an option where applicable.');
            return;
        }

        if (formData.age && formData.age < 13) {
            setError('You must be at least 13 years old.');
            return;
        }

        const success = signup(formData as User);
        if (!success) {
            setError('Email already exists');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
            <div className="w-full max-w-2xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-black text-white p-3 rounded-full">
                        <UserPlus size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter">Create Account</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-6 font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="font-black text-xl border-b-2 border-black pb-2">Personal Info</h3>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Full Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                            />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="space-y-4">
                        <h3 className="font-black text-xl border-b-2 border-black pb-2">Academic Profile</h3>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Current School</label>
                            <input
                                name="currentSchool"
                                value={formData.currentSchool}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Dream School</label>
                            <input
                                type="text"
                                name="dreamSchool"
                                value={formData.dreamSchool}
                                onChange={handleChange}
                                placeholder="Dream School"
                                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Major</label>
                            <input
                                type="text"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                placeholder="Major (e.g., Computer Science)"
                                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Study Interests (comma separated)</label>
                            <input
                                type="text"
                                name="studyInterest"
                                value={formData.studyInterest}
                                onChange={handleChange}
                                placeholder="Study Interests (comma separated)"
                                className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-1 text-xs uppercase">Preferred Time</label>
                            <select
                                name="preferredTimeframe"
                                value={formData.preferredTimeframe}
                                onChange={handleChange}
                                className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                            >
                                <option value="">Select...</option>
                                <option value="Early mornings">Early mornings</option>
                                <option value="Weekday mornings">Weekday mornings</option>
                                <option value="Afternoons">Afternoons</option>
                                <option value="Evenings">Evenings</option>
                                <option value="Weeknights">Weeknights</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-bold mb-1 text-xs uppercase">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-black py-4 text-lg uppercase tracking-widest hover:bg-gray-800 transition-transform active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="font-medium">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-black underline hover:text-blue-600"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
