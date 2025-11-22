import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, BookOpen, Clock, UserPlus, Check } from 'lucide-react';
import { INTEREST_SYNONYMS } from '../utils/synonyms';

const Match: React.FC = () => {
    const { user, profiles, addFriend } = useApp();

    // Matching Algorithm
    const getMatchScore = (profile: typeof profiles[0]) => {
        let studyScore = 0;
        let dreamSchoolScore = 0;
        let currentSchoolScore = 0;
        let timeframeScore = 0;
        let majorScore = 0;

        // 1. Study Interests
        const userInterests = user.studyInterest.toLowerCase().split(',').map(i => i.trim());
        const targetInterests = profile.studyInterest.toLowerCase().split(',').map(i => i.trim());

        // Expand user interests with synonyms
        const expandedUserInterests = new Set(userInterests);
        userInterests.forEach(interest => {
            // Check for direct synonyms
            if (INTEREST_SYNONYMS[interest]) {
                INTEREST_SYNONYMS[interest].forEach(syn => expandedUserInterests.add(syn));
            }
            // Check reverse mapping (if user interest is a synonym of a key)
            Object.entries(INTEREST_SYNONYMS).forEach(([key, synonyms]: [string, string[]]) => {
                if (synonyms.includes(interest)) {
                    expandedUserInterests.add(key);
                    synonyms.forEach(syn => expandedUserInterests.add(syn));
                }
            });
        });

        if (userInterests.length > 0) {
            const expandedList = Array.from(expandedUserInterests);
            const hasMatch = expandedList.some((i: string) => targetInterests.some((t: string) => t.includes(i) || i.includes(t)));
            if (hasMatch) {
                studyScore = 100;
            }
        }

        // 2. Dream School
        if (user.dreamSchool && profile.dreamSchool) {
            const userDream = user.dreamSchool.toLowerCase().trim();
            const profileDream = profile.dreamSchool.toLowerCase().trim();
            if (userDream.includes(profileDream) || profileDream.includes(userDream)) {
                dreamSchoolScore = 100;
            }
        }

        // 3. Current School
        if (user.currentSchool && profile.currentSchool) {
            const userCurrent = user.currentSchool.toLowerCase().trim();
            const profileCurrent = profile.currentSchool.toLowerCase().trim();
            if (userCurrent.includes(profileCurrent) || profileCurrent.includes(userCurrent)) {
                currentSchoolScore = 100;
            }
        }

        // 4. Preferred Timeframe
        if (user.preferredTimeframe && profile.preferredTimeframe) {
            const userTime = user.preferredTimeframe.toLowerCase();
            const profileTime = profile.preferredTimeframe.toLowerCase();
            // "Flexible" matches with everything
            if (userTime === 'flexible' || profileTime === 'flexible' ||
                userTime.includes(profileTime) || profileTime.includes(userTime)) {
                timeframeScore = 100;
            }
        }

        // 5. Major
        if (user.major && profile.major) {
            const userMajor = user.major.toLowerCase().trim();
            const profileMajor = profile.major.toLowerCase().trim();
            if (userMajor.includes(profileMajor) || profileMajor.includes(userMajor)) {
                majorScore = 100;
            }
        }

        // Calculate Weighted Average (Study Interest x3, Major x1, others x1)
        return ((studyScore * 3) + dreamSchoolScore + currentSchoolScore + timeframeScore + majorScore) / 7;
    };

    const matchedProfiles = React.useMemo(() => {
        return profiles
            .filter(profile => !user.friends.includes(profile.name)) // Exclude friends
            .map(profile => ({
                ...profile,
                matchScore: getMatchScore(profile)
            }))
            .filter(profile => profile.matchScore >= 50)
            .sort((a, b) => b.matchScore - a.matchScore);
    }, [profiles, user]); // Re-calculate when user profile changes

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState<'left' | 'right' | null>(null);

    const handleSwipe = (dir: 'left' | 'right') => {
        setDirection(dir);
        if (dir === 'right') {
            const profile = matchedProfiles[currentIndex];
            addFriend(profile.name);
        }

        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
            setDirection(null);
        }, 300);
    };

    const currentProfile = matchedProfiles[currentIndex];

    return (
        <div className="max-w-md mx-auto p-4 pb-20 h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-4 text-center">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Find Study Partners</h1>
                <p className="text-sm font-bold text-gray-500">
                    Study Interest Weighted x3
                </p>
            </div>

            <div className="flex-1 relative">
                {!currentProfile ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center border-4 border-black bg-gray-50 rounded-3xl p-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-black mb-2">All Caught Up!</h2>
                        <p className="text-gray-600">Check back later for more matches.</p>
                    </div>
                ) : (
                    <div
                        className={`absolute inset-0 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col transition-transform duration-300 ${direction === 'left' ? '-translate-x-[150%] rotate-12' :
                            direction === 'right' ? 'translate-x-[150%] -rotate-12' : ''
                            }`}
                    >
                        {/* Header / Avatar Area */}
                        <div className="h-1/3 bg-black relative flex items-center justify-center">
                            <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex items-center justify-center text-5xl font-black z-10">
                                {currentProfile.name[0]}
                            </div>
                            <div className="absolute top-4 right-4 bg-yellow-300 px-3 py-1 text-sm font-black border-2 border-black rotate-3">
                                {Math.round(currentProfile.matchScore)}% MATCH
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                            <div className="text-center border-b-2 border-gray-100 pb-4">
                                <h2 className="text-3xl font-black uppercase leading-none mb-1">{currentProfile.name}</h2>
                                <p className="text-lg font-bold text-gray-500">{currentProfile.age} years old</p>
                            </div>

                            {/* Match Criteria Breakdown */}
                            <div className="bg-gray-50 border-2 border-black p-3 rounded-lg mb-2">
                                <div className="text-xs font-black uppercase text-gray-500 mb-2">Match Breakdown</div>
                                <div className="grid grid-cols-5 gap-1 text-center">
                                    <div>
                                        <div className="text-xs font-bold text-gray-600">Study</div>
                                        <div className="text-sm font-black">{getMatchScore(currentProfile) >= 30 ? '✓' : '✗'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-600">Dream</div>
                                        <div className="text-sm font-black">{(user.dreamSchool && currentProfile.dreamSchool && (user.dreamSchool.toLowerCase().includes(currentProfile.dreamSchool.toLowerCase()) || currentProfile.dreamSchool.toLowerCase().includes(user.dreamSchool.toLowerCase()))) ? '✓' : '✗'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-600">School</div>
                                        <div className="text-sm font-black">{(user.currentSchool && currentProfile.currentSchool && (user.currentSchool.toLowerCase().includes(currentProfile.currentSchool.toLowerCase()) || currentProfile.currentSchool.toLowerCase().includes(user.currentSchool.toLowerCase()))) ? '✓' : '✗'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-600">Time</div>
                                        <div className="text-sm font-black">{(user.preferredTimeframe && currentProfile.preferredTimeframe && (user.preferredTimeframe.toLowerCase() === 'flexible' || currentProfile.preferredTimeframe.toLowerCase() === 'flexible' || user.preferredTimeframe.toLowerCase().includes(currentProfile.preferredTimeframe.toLowerCase()) || currentProfile.preferredTimeframe.toLowerCase().includes(user.preferredTimeframe.toLowerCase()))) ? '✓' : '✗'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-600">Major</div>
                                        <div className="text-sm font-black">{(user.major && currentProfile.major && (user.major.toLowerCase().includes(currentProfile.major.toLowerCase()) || currentProfile.major.toLowerCase().includes(user.major.toLowerCase()))) ? '✓' : '✗'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-blue-100 rounded-lg border-2 border-blue-500 shrink-0">
                                        <BookOpen size={20} className="text-blue-700" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black uppercase text-blue-500">Interests</span>
                                        <p className="font-bold leading-tight">{currentProfile.studyInterest}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-purple-100 rounded-lg border-2 border-purple-500 shrink-0">
                                        <GraduationCap size={20} className="text-purple-700" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black uppercase text-purple-500">School & Major</span>
                                        <p className="font-bold leading-tight">{currentProfile.currentSchool}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Dream: {currentProfile.dreamSchool}</p>
                                        <p className="text-xs text-gray-500">Major: {currentProfile.major}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-orange-100 rounded-lg border-2 border-orange-500 shrink-0">
                                        <Clock size={20} className="text-orange-700" />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-black uppercase text-orange-500">Availability</span>
                                        <p className="font-bold leading-tight">{currentProfile.preferredTimeframe}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 pt-0 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSwipe('left')}
                                className="py-4 border-4 border-black rounded-xl font-black text-xl hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-2xl">✕</span> PASS
                            </button>
                            <button
                                onClick={() => handleSwipe('right')}
                                className="py-4 bg-black text-white border-4 border-black rounded-xl font-black text-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-2xl">👍</span> CONNECT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Match;