import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!otp) {
            setErrorMessage('Please enter the OTP.');
            return;
        }

        try {
            await axios.post('https://recollect.lokeshdev.co/api/auth/verify-otp', { email, otp });
            alert('Account verified successfully! You can now log in.');

            navigate('/auth');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-xl font-medium">Verify OTP</h1>
                <p className="text-sm text-gray-600">Enter the OTP sent to {email}</p>
                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                <form onSubmit={handleOTPSubmit} className="mt-4">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
