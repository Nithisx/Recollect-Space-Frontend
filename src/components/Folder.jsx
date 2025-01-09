import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import Header from './Header';
import Modal from './Modal';
import Face from './Face';
import {
  PlusCircleIcon,
  ArrowUpTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { clientDecrypt, clientEncrypt } from '../utils/Encryption';

const FolderPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [folder, setFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [decryptedPhotos, setDecryptedPhotos] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState('gallery');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false); // Added state for success popup

  useEffect(() => {
    if (isSuccessPopupOpen) {
      const timer = setTimeout(() => {
        setIsSuccessPopupOpen(false);
        window.location.reload(); // Refresh to show new photos
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessPopupOpen]);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`https://recollect.lokeshdev.co/api/folders/${folderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const folderData = response.data.folder;
        setFolder(folderData || {});
        setPhotos(folderData?.photos || []);
        
        // Decrypt each photo
        const decrypted = {};
        for (const photo of folderData.photos) {
          try {
            // Convert base64 to ArrayBuffer
            const binaryString = atob(photo.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // Decrypt the photo data
            const decryptedData = await clientDecrypt(bytes.buffer);

            // Convert decrypted ArrayBuffer to base64
            const decryptedArray = new Uint8Array(decryptedData);
            let binary = '';
            decryptedArray.forEach(byte => binary += String.fromCharCode(byte));
            const decryptedBase64 = btoa(binary);

            decrypted[photo._id] = `data:${photo.contentType};base64,${decryptedBase64}`;
          } catch (error) {
            console.error(`Failed to decrypt photo ${photo._id}:`, error);
            // Use a placeholder for failed decryption
            decrypted[photo._id] = '/placeholder-image.jpg';
          }
        }

        setDecryptedPhotos(decrypted);
      } catch (error) {
        console.error(error);
        setErrorMessage('Could not fetch folder details.');
      }
    };

    fetchFolder();
  }, [folderId]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setModalMessage('Please select files to upload.');
      setIsModalOpen(true);
      return;
    }

    try {
      setUploadProgress(0); // Reset progress at start
      
      // Encrypt each file before uploading
      const encryptedFiles = await Promise.all(
        files.map((file) => clientEncrypt(file))
      );

      const formData = new FormData();
      encryptedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Upload the encrypted files
      await axios.post(`https://recollect.lokeshdev.co/api/folders/${folderId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      setIsUploadModalOpen(false); // Close upload modal
      setFiles([]); // Clear selected files
      setUploadProgress(0); // Reset progress
      setIsSuccessPopupOpen(true); // Show success message
    } catch (error) {
      console.error(error);
      setModalMessage('Error uploading files: ' + error.message);
      setIsModalOpen(true);
      setUploadProgress(0);
    }
  };


  const handleAddBlockClick = () => {
    navigate(`/folders/${folderId}/blog`);
  };

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'names' ? 'gallery' : 'names');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setFiles([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
    setIsUploadModalOpen(true);
  };

  if (errorMessage) {
    return <p className="text-red-600 text-center font-semibold">{errorMessage}</p>;
  }

  if (!folder) {
    return <p className="text-gray-700 text-center">Loading folder...</p>;
  }

  return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 transition-all duration-300">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {folder?.name || 'Untitled Folder'}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddBlockClick}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-2">
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Blogs</span>
                </span>
              </button>

              <button
                onClick={openUploadModal}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-green-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-2">
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  <span>Upload Photos</span>
                </span>
              </button>

              <button
                onClick={toggleViewMode}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              >
                {viewMode === 'gallery' ? (
                  <Squares2X2Icon className="w-5 h-5 text-gray-700" />
                ) : (
                  <ListBulletIcon className="w-5 h-5 text-gray-700" />
                )}
                <span className="text-gray-700">
                  {viewMode === 'names' ? 'Gallery' : 'List'}
                </span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center">
                <p className="text-xl font-semibold text-blue-600">
                  Drop files to upload
                </p>
              </div>
            )}

            {selectedPhotoIndex === null ? (
              viewMode === 'gallery' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {photos.map((photo, index) => (
                    <div
                      key={photo._id}
                      onClick={() => handlePhotoClick(index)}
                      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                    >
                      <img
                        src={decryptedPhotos[photo._id] || `/placeholder-image.jpg`}
                        alt={photo.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-medium truncate">
                            {photo.name || `Photo ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {photos.map((photo, index) => (
                    <div
                      key={photo._id}
                      onClick={() => handlePhotoClick(index)}
                      className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    >
                      <img
                        src={decryptedPhotos[photo._id] || `/placeholder-image.jpg`}
                        alt={photo.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {photo.name || `Photo ${index + 1}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center">
                <img
                  className="rounded-lg shadow-md mb-4"
                  src={
                    decryptedPhotos[photos[selectedPhotoIndex]._id] ||
                    `/placeholder-image.jpg`
                  }
                  alt={photos[selectedPhotoIndex].name || 'Uploaded'}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />

                <div className="mt-4 space-x-4">
                  <button
                    onClick={handlePrevPhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 ease-in-out"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 ease-in-out"
                  >
                    Next
                  </button>
                </div>

                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Photos Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 transition-opacity duration-300 opacity-100">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100 hover:scale-105">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">Upload Photos</h2>
              <button 
                onClick={closeUploadModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Selected files: {files.length}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="block w-full text-sm text-gray-700 file:py-4 file:px-6 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-gray-800 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            {/* Enhanced Upload Progress Bar */}
            {uploadProgress > 0 && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300 flex items-center justify-center"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">
                  {uploadProgress === 100 ? 'Processing...' : 'Uploading...'}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleUpload}
                disabled={uploadProgress > 0 && uploadProgress < 100}
                className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-900 transform transition-all duration-300 ${
                  uploadProgress > 0 && uploadProgress < 100
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Upload
              </button>
              <button
                onClick={closeUploadModal}
                disabled={uploadProgress > 0 && uploadProgress < 100}
                className={`bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transform transition-all duration-200 ${
                  uploadProgress > 0 && uploadProgress < 100
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {isSuccessPopupOpen && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-medium">Photos uploaded successfully!</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}

      {/* Face Component */}
      <Face folderId={folderId} />
    </div>
  </>
);
};

export default FolderPage;
