import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header";
import Modal from "./Modal";
import { PlusCircleIcon, ArrowUpTrayIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const FolderPage = () => {
    const { folderId } = useParams();
    const [folder, setFolder] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [viewMode, setViewMode] = useState('gallery');
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
    const [uploadProgress, setUploadProgress] = useState(0);


    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://15.235.147.39:3000/api/folders/${folderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const folderData = response.data.folder;
                setFolder(folderData || {});
                setPhotos(folderData?.photos || []);
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
    
        const formData = new FormData();
        files.forEach(file => {
            formData.append('photos', file);
        });
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }
    
            // Start the upload request and track progress
            await axios.post(`http://15.235.147.39:3000/api/folders/${folderId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress); // Update the progress state
                    }
                }
            });
    
            // Fetch updated folder details after upload
            const response = await axios.get(`http://15.235.147.39:3000/api/folders/${folderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const updatedFolder = response.data.folder;
            setPhotos(updatedFolder?.photos || []);
            setModalMessage('Photos uploaded successfully!');
            setIsModalOpen(true);
    
            // Hide progress bar and reset progress
            setUploadProgress(0); // Reset progress to hide the progress bar
    
            setIsSuccessPopupOpen(true);
            setTimeout(() => setIsSuccessPopupOpen(false), 3000);
    
            setFiles([]); // Clear the selected files
            setIsUploadModalOpen(false); // Close the upload modal
        } catch (error) {
            console.error(error);
            setModalMessage('Error uploading files.');
            setIsModalOpen(true);
            setUploadProgress(0); // Reset progress on error as well
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

    if (errorMessage) {
        return <p className="text-red-600 text-center font-semibold">{errorMessage}</p>;
    }

    if (!folder) {
        return <p className="text-gray-700 text-center">Loading folder...</p>;
    }

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

    return (
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
                            <button onClick={handleAddBlockClick} 
                                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center space-x-2">
                                    <PlusCircleIcon className="w-5 h-5" />
                                    <span> Blogs</span>
                                </span>
                            </button>

                            <button onClick={openUploadModal}
                                className="group relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-green-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center space-x-2">
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                    <span>Upload Photos</span>
                                </span>
                            </button>

                            <button onClick={toggleViewMode}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300">
                                {viewMode === 'gallery' ? (
                                    <Squares2X2Icon className="w-5 h-5 text-gray-700" />
                                ) : (
                                    <ListBulletIcon className="w-5 h-5 text-gray-700" />
                                )}
                                <span className="text-gray-700">{viewMode === 'names' ? 'Gallery' : 'List'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="relative"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}>
                        
                        {/* Drag & Drop Overlay */}
                        {isDragging && (
                            <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center">
                                <p className="text-xl font-semibold text-blue-600">Drop files to upload</p>
                            </div>
                        )}

                        {selectedPhotoIndex === null ? (
                            viewMode === 'gallery' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {photos.map((photo, index) => (
                                        <div key={photo._id}
                                            onClick={() => handlePhotoClick(index)}
                                            className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                                            <img
                                                src={`data:${photo.contentType};base64,${photo.data}`}
                                                alt={photo.name}
                                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="text-white font-medium truncate">{photo.name || `Photo ${index + 1}`}</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {photos.map((photo, index) => (
                                        <div key={photo._id}
                                            onClick={() => handlePhotoClick(index)}
                                            className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                                            <img
                                                src={`data:${photo.contentType};base64,${photo.data}`}
                                                alt={photo.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{photo.name || `Photo ${index + 1}`}</p>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center">
                        <img
                            className="rounded-lg shadow-md mb-4"
                            src={`data:${photos[selectedPhotoIndex].contentType};base64,${photos[selectedPhotoIndex].data}`}
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
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Upload Photos</h2>

            {/* File Input with custom styling */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Select files to upload</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    className="block w-full text-sm text-gray-700 file:py-4 file:px-6 file:rounded-lg file:border file:border-gray-300 file:bg-gray-100 file:text-gray-800 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="mt-2 text-center text-sm text-gray-600">{uploadProgress}%</p>
                </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end space-x-4 mt-8">
                <button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-900 transform transition-all duration-300"
                >
                    Upload
                </button>
                <button
                    onClick={closeUploadModal}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transform transition-all duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}



            {/* Modal for displaying messages */}
            {isModalOpen && (
                <Modal message={modalMessage} onClose={closeModal} />
            )}
        </div>
    );
};

export default FolderPage;
