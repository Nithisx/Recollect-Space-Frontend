import React from 'react';
import { 
  HeartIcon, 
  CameraIcon, 
  FolderIcon, 
  LockIcon, 
  ShareIcon, 
  StarIcon,
  CheckIcon,
  GlobeIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Ensure this is imported properly

// Import images
import image1 from '../assets/3.jpg';
import image2 from '../assets/4.jpg';
import image3 from '../assets/5.jpg';
import image4 from '../assets/6.jpg';
import image5 from '../assets/7.jpg';
import image6 from '../assets/8.jpg';
import image7 from '../assets/9.jpeg';
import image8 from '../assets/10.jpg';
import Header from './Header';

const featureImages = [image1, image2, image3, image4, image5, image6, image7, image8];

const Home = () => {
  // Define 'navigate' using 'useNavigate' inside the component
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigate = () => {
    navigate('/myfiles');  // Navigate to the '/myfiles' page
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white font-poppins relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
          {/* Hero Section with Custom Animation */}
          <div className="text-center mb-20 animate-fade-in-down">
            <div className="inline-block bg-indigo-100 text-indigo-800 px-6 py-3 rounded-full mb-6 text-sm font-medium">
              <CameraIcon className="inline-block mr-2 -mt-1 text-indigo-600" size={18} />
              Preserve Your Most Precious Moments
            </div>

            <h1 className="text-6xl font-extrabold text-gray-900 mb-8 leading-tight max-w-4xl mx-auto">
              Memories Reimagined: 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">
                Your Digital Time Capsule
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
              More than just storage, we're creating a sanctuary for your most treasured moments. 
              A platform where memories are not just saved, but celebrated and protected.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-custom"
                onClick={handleNavigate}  // Ensure the button triggers handleNavigate
              >
                Start Preserving
              </button>
              <button
                className="bg-white text-gray-800 px-10 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 transition-colors shadow-custom"
                onClick={handleNavigate}  // Ensure the button triggers handleNavigate
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[{
              icon: <FolderIcon className="w-12 h-12 text-indigo-500" />,
              title: "Smart Organization",
              description: "AI-powered folder creation and intelligent tagging.",
              image: featureImages[0]
            },
            {
              icon: <LockIcon className="w-12 h-12 text-green-500" />,
              title: "Ironclad Security",
              description: "Enterprise-grade encryption for absolute peace of mind.",
              image: featureImages[1]
            },
            {
              icon: <ShareIcon className="w-12 h-12 text-indigo-500" />,
              title: "Seamless Sharing",
              description: "Share memories with granular privacy controls.",
              image: featureImages[2]
            }].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-custom overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-3xl shadow-custom overflow-hidden mb-20">
            <div className="md:flex items-center">
              <div className="md:w-1/2">
                <img 
                  src={featureImages[5]} 
                  alt="Our Mission" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-12 space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <HeartIcon className="text-red-500 w-12 h-12" />
                  <h2 className="text-4xl font-bold text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  We're reimagining digital memory preservation. Every pixel tells a story, every moment matters.
                </p>
                <ul className="space-y-3">
                  {[
                    "Intuitive Memory Management",
                    "Cutting-Edge Security",
                    "Emotional Connection Preservation"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckIcon className="text-green-500" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-3xl p-16 text-center shadow-custom">
            <GlobeIcon className="w-24 h-24 mx-auto mb-8 text-white/20" />
            <h2 className="text-5xl font-bold mb-6">
              Your Memories, Your Legacy
            </h2>
            <p className="text-2xl mb-10 max-w-3xl mx-auto opacity-90">
              Join a community dedicated to preserving life's most beautiful moments with intelligence and care.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-gray-900 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-custom">
                Get Started Free
              </button>
              <button className="bg-transparent border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
