// src/components/FaceFinder.jsx

import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { clientEncrypt } from '../utils/Encryption'; // Correct import

const FaceFinder = ({ folderId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarPhotos, setSimilarPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageRef = useRef();
  const modalRef = useRef();

  useEffect(() => {
    loadModels();

    // Close modal on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      ]);
      setModelLoaded(true);
    } catch (error) {
      setError('Error loading face detection models. Please refresh the page.');
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFaceDescriptor = async (image) => {
    try {
      const detection = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (!detection) {
        throw new Error('No face detected in the image');
      }
      
      return detection.descriptor;
    } catch (error) {
      throw new Error('Error detecting face: ' + error.message);
    }
  };

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setSelectedImage(URL.createObjectURL(selectedFile));
    setProgress(25);
  };

  const handleUpload = async () => {
    if (!file || !modelLoaded) return;

    setLoading(true);
    setError(null);
    setProgress(25);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please log in to use this feature');
      }

      // 1. Compute the face descriptor on the original image
      setProgress(40);
      const img = await faceapi.bufferToImage(file);
      const descriptor = await getFaceDescriptor(img);
      setProgress(60);

      // 2. Encrypt the image
      const encryptedFile = await clientEncrypt(file);
      setProgress(80);

      // 3. Prepare formData with encrypted image and descriptor
      const formData = new FormData();
      formData.append('image', encryptedFile); // Upload encrypted image
      formData.append('folderId', folderId);
      formData.append('descriptor', JSON.stringify(Array.from(descriptor)));

      const response = await axios.post(
        'https://recollect.lokeshdev.co/api/photos/find-similar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.similarPhotos && response.data.similarPhotos.length > 0) {
        setSimilarPhotos(response.data.similarPhotos);
      } else {
        setError('No similar faces found');
        setSimilarPhotos([]);
      }

      setProgress(100);
    } catch (error) {
      console.error('Error finding similar faces:', error);
      setError(error.response?.data?.message || error.message || 'Error processing image');
      setSimilarPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFile(null);
    setSimilarPhotos([]);
    setError(null);
    setProgress(0);
  };

  const closeModal = () => {
    setIsOpen(false);
    handleReset();
  };

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-transform transform hover:scale-110"
      >
        <Plus size={24} />
      </button>
      {isOpen && (
        <div 
          ref={modalRef}
          onClick={handleModalClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Find Similar Faces</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {error}
                </div>
              )}

              {/* File Input and Preview */}
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50"
                  disabled={loading}
                />

                {selectedImage && (
                  <div className="relative">
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      alt="Selected"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* Custom Progress Bar */}
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      {progress < 100 ? 'Processing...' : 'Complete!'}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  {selectedImage && !loading && (
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Find Similar
                    </button>
                  )}
                </div>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <div className="text-gray-600">Processing image...</div>
                </div>
              )}

{!loading && similarPhotos.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold mb-4">Similar Photos Found</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {similarPhotos.map((photo) => {
        // Sanitize similarity value before using it
        const similarity = Number(photo.similarity);
        
        return (
          <div 
            key={photo._id} 
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={photo.data}
              alt={photo.name || "Similar face"}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Similarity</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {isNaN(similarity) ? 'N/A' : similarity.toFixed(2) + '%'}
                </span>
              </div>
              {photo.name && (
                <div className="text-sm text-gray-600 mt-1">
                  {photo.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FaceFinder;
