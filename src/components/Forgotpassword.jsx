import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            setSuccess('OTP has been sent to your email');
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        if (!newPassword) {
            setError('Please enter a new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/reset-password', {
                email,
                resetToken: parseInt(otp),
                newPassword
            });
            alert("Password reset successful!")
            setSuccess('Password reset successful!');
            setTimeout(() => {
                navigate('/auth');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
            alert(setError)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/auth')}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;