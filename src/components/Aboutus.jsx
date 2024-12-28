import React, { useRef, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Header from './Header';

// Image imports
import video from "../assets/vidieo.mp4"
import featureImage1 from '../assets/1.jpg';
import featureImage2 from '../assets/2.jpg';
import image1 from '../assets/3.jpg';
import image2 from '../assets/4.jpg';
import image3 from '../assets/5.jpg';
import image4 from '../assets/6.jpg';
import image5 from '../assets/7.jpg';
import image6 from '../assets/8.jpg';
import image7 from '../assets/9.jpeg';
import image8 from '../assets/10.jpg';

const featureImages = [image1, image2, image3, image4, image5,image6,image7,image8];


const Aboutus = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch(error => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen text-center text-white">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          id="bg-video"
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="z-10 bg-black bg-opacity-50 p-10 rounded-xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Digital Memory Preservation Platform
          </h1>
          <p className="text-lg md:text-2xl mb-8">
            Transforming Memory Management with Cutting-Edge Technology
          </p>
          <a
            href="#services"
            className="bg-cyan-400 text-white py-2 px-8 rounded-full text-lg hover:bg-cyan-500 transition-colors"
          >
            Discover Our Solutions
          </a>
        </div>
      </section>

      {/* Professional Services Section */}
      <section id="services" className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Enterprise-Grade Memory Management Solutions</h2>
        <div className="flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-10 px-6">
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-3">
            <i className="fas fa-chart-line text-4xl mb-4 text-cyan-400"></i>
            <h3 className="text-2xl font-semibold mb-2">Cost-Effective</h3>
            <p>Optimized Pricing Strategies for Maximum Value</p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-3">
            <i className="fas fa-shield-alt text-4xl mb-4 text-cyan-400"></i>
            <h3 className="text-2xl font-semibold mb-2">Enterprise Security</h3>
            <p>Military-Grade Data Protection Protocols</p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-3">
            <i className="fas fa-cogs text-4xl mb-4 text-cyan-400"></i>
            <h3 className="text-2xl font-semibold mb-2">Scalable Solutions</h3>
            <p>Flexible Infrastructure for Growing Enterprises</p>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="features" className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Advanced Digital Memory Ecosystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-gray-100 p-8 rounded-lg text-center shadow-lg">
            <div className="text-4xl mb-4 text-cyan-400">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Enterprise Cloud Storage</h3>
            <p>Secure, Scalable, and Compliant Cloud Infrastructure for Comprehensive Memory Archiving</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg text-center shadow-lg">
            <div className="text-4xl mb-4 text-cyan-400">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Collaborative Platforms</h3>
            <p>Advanced Sharing Mechanisms with Granular Access Control</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg text-center shadow-lg">
            <div className="text-4xl mb-4 text-cyan-400">
              <i className="fas fa-brain"></i>
            </div>
            <h3 className="text-2xl font-semibold mb-4">AI-Powered Insights</h3>
            <p>Machine Learning Algorithms for Intelligent Memory Categorization and Enhancement</p>
          </div>
        </div>
      </section>

      {/* Extended Professional Features */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Innovative Memory Management Solutions</h2>
        <div className="grid md:grid-cols-2 gap-10 px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={featureImage1} 
              alt="Advanced Memory Intelligence" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Intelligent Memory Taxonomization</h3>
              <p>Advanced AI-driven categorization leveraging machine learning for precise memory organization and retrieval.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={featureImage2} 
              alt="Enterprise Collaboration Ecosystem" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Enterprise Collaboration Framework</h3>
              <p>Seamless multi-tier collaboration platforms with advanced permission management and secure sharing protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-10">Enterprise Client Testimonials</h2>
        <div className="flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-10 px-6">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="italic mb-4">
              "A transformative solution that revolutionized our digital memory infrastructure with unparalleled efficiency."
            </p>
            <h4 className="font-semibold">Natesan, CTO, META & Co</h4>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="italic mb-4">
              "Exceptional scalability and enterprise-grade security that exceeded our most rigorous technological requirements."
            </p>
            <h4 className="font-semibold">Mukilan T, Executive Chairman, META & Co</h4>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="italic mb-4">
              "Unprecedented AI-driven memory management that delivers tangible strategic advantages for our organization."
            </p>
            <h4 className="font-semibold">Lokesh, Chief Strategy Officer, META & Co</h4>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Meet Our Passionate Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Rodriguez",
                role: "Founder & CEO",
                description: "Visionary leader bridging technology and emotional storytelling.",
                image: featureImages[4]
              },
              {
                name: "Alex Chen",
                role: "Chief Technology Officer",
                description: "Tech innovator dedicated to secure, user-centric platforms.",
                image: featureImages[3]
              },
              {
                name: "Sarah Thompson",
                role: "Design & Experience",
                description: "Design philosopher creating intuitive memory interfaces.",
                image: featureImages[6]
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-custom p-8 transform transition-all duration-300 hover:scale-105"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-indigo-100 shadow-custom"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      {/* Footer */}
      <footer className="bg-cyan-400 py-6">
        <div className="text-center text-white mb-4">
          <p>&copy; 2024 META MEMORIES. All Enterprise Rights Reserved.</p>
        </div>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaFacebookF />
          </a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaInstagram />
          </a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Aboutus;