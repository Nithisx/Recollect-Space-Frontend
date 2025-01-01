import React from 'react';
import { motion } from 'framer-motion';
import image1 from '../assets/3.jpg';
import image2 from '../assets/4.jpg';
import image3 from '../assets/Mukilan.jpeg';
import image4 from '../assets/Lokesh.jpeg';
import image5 from '../assets/Pratheesh.jpeg';
import image6 from '../assets/Nithish.jpeg';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div className="bg-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-white h-screen flex items-center justify-center">
  <motion.div 
    className="container mx-auto px-6 text-center space-y-8"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.5 }}
  >
    <motion.h1 
      className="text-6xl font-extrabold text-gray-900 leading-tight"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
    >
      Recollect Your Moments with AI
    </motion.h1>
    
    <motion.p 
      className="text-2xl font-light text-gray-700 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
    >
      Store, organize, and share your photos in personalized folders with the help of AI. Our intelligent system automatically categorizes your memories and helps you create meaningful stories with integrated blogging features. Connect with family and friends, and let AI help you relive and share life’s precious moments.
    </motion.p>
    
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <button className="bg-yellow-500 text-gray-900 py-3 px-8 rounded-full text-xl font-semibold transition-transform transform hover:scale-105">
        Start Recollecting
      </button>
    </motion.div>
  </motion.div>
      </section>


      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-16">Key Features of Recollect Space</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[ 
        { 
          icon: "📸", 
          title: "Organize Photos with AI", 
          description: "AI-driven tools automatically categorize and tag your photos, making it easy to upload, organize, and find your memories in personalized folders."
        },
        { 
          icon: "🔒", 
          title: "Secure Sharing", 
          description: "Share your memories securely with family and friends, allowing them to view or contribute to your albums, while AI helps manage permissions and ensure privacy."
        },
        { 
          icon: "✍️", 
          title: "AI-Powered Blogging", 
          description: "Use AI-assisted suggestions to create meaningful narratives and blogs around your photos, transforming them into rich, personalized stories."
        },
        { 
          icon: "🗂️", 
          title: "Custom Folders", 
          description: "Create custom folders for themes, events, or moments, with AI helping to suggest relevant organization structures based on your photo content."
        },
        { 
          icon: "🌐", 
          title: "Global Access", 
          description: "Access your memories anytime, anywhere, across devices, with cloud storage powered by AI to optimize data retrieval and management."
        },
        { 
          icon: "👨‍👩‍👧‍👦", 
          title: "Collaborative Memories", 
          description: "Invite family and friends to contribute to shared folders and albums, while AI helps highlight the most relevant moments to share in real-time."
        }
      ].map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <motion.div
            className="text-5xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
      </section>


      {/* Mission Section */}
      <section className="py-20">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Image Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
      >
        <img 
          src={image2} 
          alt="Mission" 
          className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
        />
      </motion.div>

      {/* Text Animation */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-4xl font-bold">Our Mission</h2>
        <p className="text-gray-600 text-lg">
          At Recollect Space, our mission is to empower you to capture, organize, and share your most treasured moments—helped by the power of **AI**. 
          We believe in creating a platform where memories are not just stored, but intelligently curated into meaningful stories. 
          With AI-driven features like automatic photo tagging, personalized recommendations, and content suggestions, we make it easier than ever to relive and share your moments with the people who matter most.
        </p>
      </motion.div>
    </div>
  </div>
      </section>

      {/* How Recollect Space Works Section */}
      <section className="py-20 bg-white text-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-600">How Recollect Space Works 🚀</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Step 1: Upload Photos */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="bg-blue-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
            >
              <div className="text-4xl text-blue-600">
                📥
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Upload Your Photos</h3>
              <p className="text-lg text-gray-600 text-center">
                Quickly upload your photos from any device and start organizing them into albums.
              </p>
            </motion.div>

            {/* Step 2: Create Folders */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="bg-green-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
            >
              <div className="text-4xl text-green-600">
                📂
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Create Personalized Folders</h3>
              <p className="text-lg text-gray-600 text-center">
                Organize your photos into custom folders, whether by events, themes, or special moments.
              </p>
            </motion.div>

            {/* Step 3: Share & Collaborate */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="bg-yellow-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
            >
              <div className="text-4xl text-yellow-600">
                🤝
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Share & Collaborate</h3>
              <p className="text-lg text-gray-600 text-center">
                Share your albums with friends and family and invite them to add their own memories.
              </p>
            </motion.div>

            {/* Step 4: Create Blogs & Stories */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="bg-purple-100 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
            >
              <div className="text-4xl text-purple-600">
                📖
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Create Blogs & Stories</h3>
              <p className="text-lg text-gray-600 text-center">
                Add captions, stories, and personal blogs to your photos, capturing the essence of each moment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
    <div className="grid md:grid-cols-4 gap-8">
      {[ 
        { img: image3, name: "Mukilan", role: "AI Engineer" },
        { img: image4, name: "Lokesh", role: "DevOps Engineer" },
        { img: image5, name: "Pratheesh", role: "Front-End Developer" },
        { img: image6, name: "Nithish", role: "Full-Stack Developer" }
      ].map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}  // Ensures animation triggers once when the section comes into view
          transition={{
            delay: index * 0.2, // Stagger the animation for each team member
            duration: 0.8,
            type: 'spring',
            stiffness: 80
          }}
          className="group"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105 group-hover:rotate-3 group-hover:translate-y-2">
            <img 
              src={member.img} 
              alt={member.name} 
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
      </section>



      
      <Footer />

    </div>
  );
};

export default AboutUs;
