// src/components/Myfiles.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderPlusIcon,
  SearchIcon,
  FolderOpenIcon,
  StarIcon,
  TagIcon,
  ClockIcon,
  Trash2Icon,
  AlertCircleIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react';
import Header from './Header';

export const Myfiles = () => {
  // State Management
  const [folders, setFolders] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState({
    isOpen: false,
    folderId: null,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    folderId: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    totalFolders: 0,
    recentFolder: null,
    favoriteFolder: null,
  });

  const navigate = useNavigate();

  // Fetch user data and folders on component mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchFolders(loggedInUser._id);
    } else {
      setLoading(false);
      setError('Please log in to view your folders');
      navigate('/auth');
    }
  }, [navigate]);

  // Fetch both OWNED and SHARED folders
  const fetchFolders = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // 1) Owned folders
      const ownedRes = await axios.get(
        `https://15.235.147.39:5003/api/folders/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2) Folders shared with me
      const sharedRes = await axios.get(
        `https://15.235.147.39:5003/api/folders/shared`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ownedFolders = ownedRes.data.folders || [];
      const sharedFolders = sharedRes.data || [];

      // Combine them if you want to show them in one list
      const allFolders = [...ownedFolders, ...sharedFolders];

      setFolders(allFolders);

      // Update quick stats
      setQuickStats({
        totalFolders: allFolders.length,
        recentFolder:
          allFolders.length > 0
            ? allFolders.reduce((latest, folder) =>
                new Date(folder.createdAt) > new Date(latest.createdAt)
                  ? folder
                  : latest
              )
            : null,
        favoriteFolder: allFolders.find((folder) => folder.isFavorite),
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching folders');
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new folder
  const addFolder = async () => {
    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        'https://15.235.147.39:5003/api/folders/create-folder',
        {
          name: folderName.trim(),
          section: 'memory',
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add newly created folder to state
      setFolders([...folders, response.data.folder]);
      setFolderName('');
      setIsModalOpen(false);
      setError('');

      // Update quick stats
      setQuickStats((prev) => ({
        ...prev,
        totalFolders: prev.totalFolders + 1,
        recentFolder: response.data.folder,
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating folder');
      console.error('Error creating folder:', error);
    }
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`https://15.235.147.39:5003/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from state
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderId)
      );

      // Update quick stats
      setQuickStats((prev) => {
        const updatedFolders = folders.filter(
          (folder) => folder._id !== folderId
        );
        return {
          ...prev,
          totalFolders: prev.totalFolders - 1,
          recentFolder:
            updatedFolders.length > 0
              ? updatedFolders.reduce((latest, folder) =>
                  new Date(folder.createdAt) > new Date(latest.createdAt)
                    ? folder
                    : latest
                )
              : null,
          favoriteFolder:
            prev.favoriteFolder?._id === folderId ? null : prev.favoriteFolder,
        };
      });

      setDeleteConfirmation({ isOpen: false, folderId: null });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting folder');
      setDeleteConfirmation({ isOpen: false, folderId: null });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setError('');
  };

  // Render error message
  const renderError = () =>
    error && (
      <div
        className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="flex items-center">
          <AlertCircleIcon className="mr-2" size={20} />
          {error}
        </span>
        <span
          className="absolute top-0 right-0 px-4 py-3 cursor-pointer"
          onClick={() => setError('')}
        >
          <svg
            className="h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    );

  // Render loading state
  const renderLoading = () =>
    loading && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );

  // Render create folder modal
  const renderCreateFolderModal = () =>
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-96"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create New Folder
          </h2>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter folder name"
          />
          <div className="flex justify-between space-x-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFolderName('');
                setError('');
              }}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={addFolder}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create
            </button>
          </div>
        </motion.div>
      </div>
    );

  // Render delete confirmation modal
  const renderDeleteConfirmationModal = () =>
    deleteConfirmation.isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-96"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Delete Folder
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Are you sure you want to delete this folder? This action cannot be
            undone.
          </p>
          <div className="flex justify-between space-x-4">
            <button
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, folderId: null })
              }
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteFolder(deleteConfirmation.folderId)}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    );

  // Folders grid
  const renderFoldersGrid = () => (
    <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-6 self-start">
      {folders.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-12">
          <p className="text-xl">No folders created yet</p>
          <p className="text-sm mt-2">Click "Create New Folder" to get started</p>
        </div>
      ) : (
        folders
          .filter((folder) =>
            folder.name.toLowerCase().includes(searchTerm)
          )
          .map((folder) => (
            <motion.div
              key={folder._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-4 relative group"
            >
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/folder/${folder._id}`)}
              >
                <FolderOpenIcon className="text-blue-500 mb-3" size={48} />
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {folder.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmation({
                    isOpen: true,
                    folderId: folder._id,
                  });
                }}
                className="absolute top-2 right-2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 rounded-full"
                title="Delete folder"
              >
                <Trash2Icon size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShareModalOpen({ isOpen: true, folderId: folder._id });
                }}
                className="absolute top-2 right-10 p-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-50 rounded-full"
                title="Share folder"
              >
                <UserPlusIcon size={20} />
              </button>
            </motion.div>
          ))
      )}
    </div>
  );

  // Share folder modal component
  const ShareFolderModal = ({ isOpen, onClose, folderId, onShare }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('view'); // 'view' or 'edit'

    const handleShare = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await axios.post(
          `https://15.235.147.39:5003/api/folders/${folderId}/share`,
          { email, permission },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // onShare callback to update local state
        onShare(response.data);
        onClose();
      } catch (error) {
        console.error(
          'Error sharing folder:',
          error.response ? error.response.data : error.message
        );
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Share Folder</h3>
            <button onClick={onClose}>
              <XIcon />
            </button>
          </div>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="view">View only</option>
            <option value="edit">Can edit</option>
          </select>
          <button
            onClick={handleShare}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-6 py-8 flex flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">My Memories</h2>
              <p className="text-gray-500 mt-2">
                Preserve Your Precious Moments
              </p>
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="Search folders"
              />
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 mb-6"
            >
              <FolderPlusIcon className="mr-2" /> Create New Folder
            </button>

            {/* "Shared With Me" Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserPlusIcon className="mr-2 text-purple-500" size={20} />{' '}
                Shared With Me
              </h3>
              <div className="space-y-3">
                {/*
                  Filter: Only folders that 
                    - the current user is NOT the owner 
                    - but user._id is in the sharedWith array
                */}
                {folders
                  .filter(
                    (folder) =>
                      folder.userId !== user._id &&
                      folder.sharedWith?.some(
                        (share) => share.user._id === user._id
                      )
                  )
                  .map((folder) => (
                    <div
                      key={folder._id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/folder/${folder._id}`)}
                    >
                      <div className="flex items-center">
                        <FolderOpenIcon className="text-purple-400 mr-2" size={16} />
                        <span className="text-gray-700">{folder.name}</span>
                      </div>
                    </div>
                  ))}

                {folders.filter(
                  (folder) =>
                    folder.userId !== user._id &&
                    folder.sharedWith?.some(
                      (share) => share.user._id === user._id
                    )
                ).length === 0 && (
                  <p className="text-gray-500 text-center text-sm py-2">
                    No folders shared with you yet
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TagIcon className="mr-2 text-blue-500" size={20} /> Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <FolderOpenIcon className="mr-2 text-blue-400" size={16} />
                    Total Folders
                  </span>
                  <span className="font-bold text-gray-800">
                    {quickStats.totalFolders}
                  </span>
                </div>

                {quickStats.recentFolder && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <ClockIcon className="mr-2 text-green-400" size={16} />
                      Most Recent
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {quickStats.recentFolder.name}
                    </span>
                  </div>
                )}

                {quickStats.favoriteFolder && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <StarIcon className="mr-2 text-yellow-400" size={16} />
                      Favorite Folder
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {quickStats.favoriteFolder.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-gray-600 mt-auto">
              <p>
                Your digital memory vault. Organize, cherish, and relive your
                most meaningful moments.
              </p>
            </div>
          </div>

          {/* Folders Grid */}
          {renderFoldersGrid()}
        </div>
      </div>

      {/* Modals and Notifications */}
      {renderCreateFolderModal()}
      {renderDeleteConfirmationModal()}

      {shareModalOpen?.isOpen && (
        <ShareFolderModal
          isOpen={shareModalOpen.isOpen}
          onClose={() => setShareModalOpen({ isOpen: false, folderId: null })}
          folderId={shareModalOpen.folderId}
          onShare={(data) => {
            // Update local "folders" state to reflect new "sharedWith" user
            setFolders((prevFolders) =>
              prevFolders.map((folder) =>
                folder._id === data.folderId
                  ? {
                      ...folder,
                      sharedWith: [
                        ...(folder.sharedWith || []),
                        { user: { _id: data.sharedWith }, permission: data.permission },
                      ],
                    }
                  : folder
              )
            );
          }}
        />
      )}

      {renderError()}
      {renderLoading()}
    </div>
  );
};

export default Myfiles;
