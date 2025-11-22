import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn } from 'lucide-react';

const Login: React.FC<{ onSwitchToSignup: () => void }> = ({ onSwitchToSignup }) => {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const success = login(email, password);
        if (!success) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <div className="flex items-center justify-center mb-8">
                    <div className="bg-black text-white p-3 rounded-full">
                        <LogIn size={32} />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter">Welcome Back</h2>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-6 font-bold text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-black py-4 text-lg uppercase tracking-widest hover:bg-gray-800 transition-transform active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="font-medium">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="font-black underline hover:text-blue-600"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
