import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import image7 from '../assets/9.jpeg';
import image8 from '../assets/10.jpg';

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
            {message}
        </div>
    );
};

const Login = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const [showOTPPopup, setShowOTPPopup] = useState(false);
    const [otp, setOtp] = useState('');
    const [tempCredentials, setTempCredentials] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const showSignup = () => {
        setIsLoginVisible(false);
        setEmail('');
        setPassword('');
        setErrorMessage('');
    };

    const showLogin = () => {
        setIsLoginVisible(true);
        setEmail('');
        setPassword('');
        setErrorMessage('');
    };

    const performLogin = async (credentials) => {
        try {
            const response = await axios.post('https://15.235.147.39:5003/api/auth/login', credentials);
            const loggedInUser = response.data.user;
            const token = response.data.token;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);

            navigate('/myfiles');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed');
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!otp) {
            setErrorMessage('Please enter the OTP.');
            return;
        }

        try {
            await axios.post('https://15.235.147.39:5003/api/auth/verify-otp', { 
                email: tempCredentials.email, 
                otp 
            });
            
            await performLogin(tempCredentials);
            
            setShowOTPPopup(false);
            setTempCredentials(null);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        if (!email || !password) {
            setErrorMessage('Please fill in both fields.');
            return;
        }
    
        try {
            if (!isLoginVisible) {
                setTempCredentials({ email, password });
                await axios.post('https://15.235.147.39:5003/api/auth/send-otp', { email, password });
                setShowOTPPopup(true);
            } else {
                await performLogin({ email, password });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        setToast({ show: true, message: 'Logged out successfully' });
    };

    const OTPPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center relative">
                <button 
                    onClick={() => setShowOTPPopup(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
                <h1 className="text-xl font-medium">Verify OTP</h1>
                <p className="text-sm text-gray-600">Enter the OTP sent to {tempCredentials?.email}</p>
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

    

    if (user) {
        return (
            <>
                <Header />
                {/* Main Container */}
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Hero Section */}
                        <div className="relative">
                            <img
                                src={image7}
                                alt="Background"
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <h1 className="text-3xl text-white font-bold">
        Welcome, {user.email.split('@')[0]}!
    </h1>
</div>

                        </div>
    
                        {/* Content Section */}
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                            <p className="text-gray-600 mt-2">
                                Explore your profile, manage settings, and discover new features.
                            </p>
    
                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button
                                    onClick={() => navigate("../aboutus")}
                                    className="flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    
                                    <span className="ml-2">Explore</span>
                                </button>
                                <button
                                    onClick={() => navigate("../myfiles")}
                                    className="flex items-center justify-center bg-green-500 text-white px-4 py-3 rounded-lg shadow hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-green-300"
                                >
                                    
                                    <span className="ml-2">My files</span>
                                </button>
                            </div>
                        </div>
    
                        {/* Logout Button */}
                        <div className="p-6">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition focus:outline-none focus:ring-4 focus:ring-red-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
    
                {/* Toast Notification */}
                {toast.show && (
                    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
                        <span className="material-icons">notifications</span>
                        <p className="text-sm">{toast.message}</p>
                        <button
                            onClick={() => setToast({ show: false, message: '' })}
                            className="text-gray-400 hover:text-white transition"
                        >
                            Close
                        </button>
                    </div>
                )}
            </>
        );
    }

    
    

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white rounded-lg flex overflow-hidden w-full max-w-3xl h-96 relative">
                    <div
                        className={`w-1/2 p-8 transition-transform duration-500 ${isLoginVisible ? 'scale-100' : 'scale-0'}`}
                    >
                        <h1 className="text-xl font-medium">Log In</h1>
                        <p className="text-sm text-gray-600">Login to your account to upload or download pictures, videos, or music.</p>
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                            <a href="/forgot-password" className="text-sm text-blue-500">Forgot Password?</a>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                                    Login <i className="fas fa-angle-right"></i>
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-sm mt-4">
                            Don't have an account yet?{' '}
                            <span className="text-blue-500 cursor-pointer" onClick={showSignup}>
                                Sign up
                            </span>
                        </p>
                    </div>

                    <div
                        className={`w-1/2 p-8 transition-transform duration-500 ${isLoginVisible ? 'scale-0' : 'scale-100'}`}
                    >
                        <h1 className="text-xl font-medium">Signup</h1>
                        <p className="text-sm text-gray-600">Create your account to upload or download pictures, videos, or music.</p>
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                                    Signup <i className="fas fa-angle-right"></i>
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-sm mt-4">
                            Already have an account?{' '}
                            <span className="text-blue-500 cursor-pointer" onClick={showLogin}>
                                Login here
                            </span>
                        </p>
                    </div>

                    <div
                        className={`absolute right-0 top-0 h-full w-1/2 transition-transform duration-500 ${isLoginVisible ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <img
                            src="https://img.freepik.com/free-vector/abstract-flat-design-background_23-2148450082.jpg?size=626&ext=jpg&ga=GA1.1.1286474015.1708934801&semt=sph"
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            {showOTPPopup && <OTPPopup />}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    onClose={() => setToast({ show: false, message: '' })} 
                />
            )}
        </>
    );
};

export default Login;