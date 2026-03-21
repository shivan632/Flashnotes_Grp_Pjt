// frontend/src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Store email for OTP verification
            localStorage.setItem('pendingVerification', response.email);
            if (response.otp) {
                localStorage.setItem('devOTP', response.otp);
            }

            // Navigate to OTP verification page
            navigate('/verify-otp', { state: { email: response.email } });
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#111827] to-[#0F172A] py-12 px-4">
            <div className="max-w-md w-full bg-[#1F2937] rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-400 mt-2">Join Flashnotes today</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder="Create a password (min 6 characters)"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#111827] border border-[#374151] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-[#60A5FA] hover:to-[#8B5CF6] text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="loading-spinner-small"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-[#60A5FA] hover:text-[#3B82F6]">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;