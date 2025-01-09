// src/components/BlogPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  BookOpenIcon, 
  PlusIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Header from "./Header";
import { 
  clientEncryptText, 
  clientDecryptText 
} from '../utils/encryption'; // Import encryption functions

const BlogPage = () => {
  const { folderId } = useParams();
  const [folderName, setFolderName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false); // State to control success message visibility

  // Update document title effect
  useEffect(() => {
    document.title = folderName ? `${folderName} | Blog Folder` : 'Blog Folder';
    return () => {
      document.title = 'Blog Application';
    };
  }, [folderName]);

  useEffect(() => {
    const fetchFolderAndBlogs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication required");

        const [folderResponse, blogsResponse] = await Promise.all([
          axios.get(`https://recollect.lokeshdev.co/api/folders/${folderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://recollect.lokeshdev.co/api/folders/${folderId}/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setFolderName(folderResponse.data.folder.name);

        // Decrypt blogs
        const decryptedBlogs = await Promise.all(blogsResponse.data.map(async blog => {
          const decryptedTitle = await clientDecryptText(blog.title);
          const decryptedContent = await clientDecryptText(blog.content);

          return {
            ...blog,
            title: decryptedTitle,
            content: decryptedContent
          };
        }));

        setBlogs(decryptedBlogs);
      } catch (error) {
        setErrorMessage("Unable to load folder or blogs. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderAndBlogs();
  }, [folderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      // Encrypt title and content
      setIsLoading(true);
      setErrorMessage("");

      const encryptedTitle = await clientEncryptText(title);
      const encryptedContent = await clientEncryptText(content);

      // Send encrypted data to server
      const response = await axios.post(
        `https://recollect.lokeshdev.co/api/folders/${folderId}/blogs`,
        { title: encryptedTitle, content: encryptedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Decrypt the newly created blog
      const decryptedTitle = await clientDecryptText(response.data.blog.title);
      const decryptedContent = await clientDecryptText(response.data.blog.content);

      setBlogs([{
        ...response.data.blog,
        title: decryptedTitle,
        content: decryptedContent
      }, ...blogs]);

      setTitle("");
      setContent("");
      setModalMode(null);

      // Show success message and refresh page after 3 seconds
      setIsSaveSuccess(true);
      setTimeout(() => {
        setIsSaveSuccess(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      setErrorMessage("Failed to save blog. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBlogDetailModal = () => {
    if (!selectedBlog) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
          <button 
            onClick={() => setSelectedBlog(null)}
            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-t-2xl">
            <h2 className="text-4xl font-bold mb-4 text-white">{selectedBlog.title}</h2>
            <div className="flex items-center text-sm space-x-4">
              <span className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-8 prose max-w-none">
            <p className="text-gray-800 leading-relaxed text-lg">{selectedBlog.content}</p>
          </div>

          <div className="p-8 bg-gray-50 border-t">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">More Blogs</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs
                .filter(blog => blog._id !== selectedBlog._id)
                .slice(0, 3)
                .map(blog => (
                  <div 
                    key={blog._id} 
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{blog.title}</h4>
                    <p className="text-sm text-gray-600">
                      {blog.content.length > 100 
                        ? blog.content.slice(0, 100) + '...' 
                        : blog.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!modalMode) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
          <button 
            onClick={() => setModalMode(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>

          <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center">
            <PlusIcon className="w-8 h-8 mr-3 text-indigo-600" />
            Create New Blog Entry
          </h2>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4 flex items-center">
              <ExclamationCircleIcon className="w-6 h-6 mr-3 text-red-600" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Blog Title
              </label>
              <input 
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                Blog Content
              </label>
              <textarea 
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog entry here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => setModalMode(null)}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderBlogCard = (blog) => {
    const truncatedContent = blog.content.length > 150 
      ? blog.content.slice(0, 150) + '...' 
      : blog.content;

    return (
      <div 
        key={blog._id} 
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group"
      >
        <div className="p-6 relative">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setSelectedBlog(blog)}
              className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {blog.title}
          </h3>
          <p className="text-gray-600 mb-4 text-base">{truncatedContent}</p>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <button 
              onClick={() => setSelectedBlog(blog)}
              className="text-indigo-600 hover:underline flex items-center"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Read More
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Animated Header with Enhanced Visibility */}
          <header className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text mb-4 flex items-center justify-center">
                <BookOpenIcon className="w-12 h-12 mt-auto mr-4 text-indigo-600" />
                <span>{folderName}</span> Blogs
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Dive into a world of thoughts, ideas, and stories curated in this unique blog folder.
            </p>
          </header>
            
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => setModalMode('create')}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="w-6 h-6 mr-2" />
              Create New Blog
            </button>
          </div>

          {/* Success message animation */}
          {isSaveSuccess && (
            <div className="fixed top-0 right-0 m-8 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-transform transform scale-100 animate__animated animate__fadeIn animate__delay-1s">
              Blog saved successfully!
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-gray-600">
              <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-600 py-12 bg-white rounded-xl shadow-md">
              <BookOpenIcon className="w-20 h-20 mx-auto text-indigo-500 mb-4" />
              <p className="text-2xl">No blogs in this folder yet</p>
              <p className="text-gray-500 mt-2">Start your writing journey by creating a new blog!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(renderBlogCard)}
            </div>
          )}
        </div>

        {renderModal()}
        {renderBlogDetailModal()}
      </div>
    </>
  );
};

export default BlogPage;
