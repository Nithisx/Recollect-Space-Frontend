"use client"

import { useState, useRef, useEffect } from "react"
import * as faceapi from "face-api.js"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { clientEncrypt } from "../utils/Encryption"

// Import icons directly instead of using shadcn components
import { AlertCircle, ArrowLeft, Brain, Camera, Check, Loader2, Search, Upload, X } from "lucide-react"

export default function FaceFinder({ folderId }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [similarPhotos, setSimilarPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const imageRef = useRef()
  const modalRef = useRef()
  const fileInputRef = useRef()

  const steps = [
    { title: "Select Image", description: "Upload a photo with a face" },
    { title: "Processing", description: "Analyzing facial features" },
    { title: "Results", description: "View similar faces found" },
  ]

  useEffect(() => {
    if (isOpen && !modelLoaded) {
      loadModels()
    }

    // Close modal on escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const loadModels = async () => {
    try {
      setLoading(true)

      // Simulate progressive loading for better UX
      const models = [
        { name: "Face Detection", loader: faceapi.nets.ssdMobilenetv1.loadFromUri("/models") },
        { name: "Facial Landmarks", loader: faceapi.nets.faceLandmark68Net.loadFromUri("/models") },
        { name: "Face Recognition", loader: faceapi.nets.faceRecognitionNet.loadFromUri("/models") },
      ]

      for (let i = 0; i < models.length; i++) {
        setModelLoadingProgress(Math.floor((i / models.length) * 70))
        await models[i].loader
      }

      setModelLoadingProgress(100)
      setModelLoaded(true)
    } catch (error) {
      setError("Error loading face detection models. Please refresh the page.")
      console.error("Error loading models:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFaceDescriptor = async (image) => {
    try {
      const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()

      if (!detection) {
        throw new Error("No face detected in the image")
      }

      return detection.descriptor
    } catch (error) {
      throw new Error("Error detecting face: " + error.message)
    }
  }

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setError(null)
    setFile(selectedFile)
    setSelectedImage(URL.createObjectURL(selectedFile))
    setProgress(25)
    setActiveStep(1)
  }

  const handleUpload = async () => {
    if (!file || !modelLoaded) return

    setLoading(true)
    setError(null)
    setProgress(25)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Please log in to use this feature")
      }

      // 1. Compute the face descriptor on the original image
      setProgress(40)
      const img = await faceapi.bufferToImage(file)
      const descriptor = await getFaceDescriptor(img)
      setProgress(60)

      // 2. Encrypt the image
      const encryptedFile = await clientEncrypt(file)
      setProgress(80)

      // 3. Prepare formData with encrypted image and descriptor
      const formData = new FormData()
      formData.append("image", encryptedFile) // Upload encrypted image
      formData.append("folderId", folderId)
      formData.append("descriptor", JSON.stringify(Array.from(descriptor)))

      const response = await axios.post("https://recollect.lokeshdev.co/api/photos/find-similar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.similarPhotos && response.data.similarPhotos.length > 0) {
        setSimilarPhotos(response.data.similarPhotos)
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1500)
      } else {
        setError("No similar faces found")
        setSimilarPhotos([])
      }

      setProgress(100)
      setActiveStep(2)
    } catch (error) {
      console.error("Error finding similar faces:", error)
      setError(error.response?.data?.message || error.message || "Error processing image")
      setSimilarPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setFile(null)
    setSimilarPhotos([])
    setError(null)
    setProgress(0)
    setActiveStep(0)
  }

  const closeModal = () => {
    setIsOpen(false)
    handleReset()
  }

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal()
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <>
      {/* Animated Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-70 animate-pulse" />
        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center">
          <Brain className="w-7 h-7" />
        </div>
        <span className="absolute -top-2 -right-2 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500"></span>
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            onClick={handleModalClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Modal Header */}
              <div className="border-b dark:border-gray-800 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    AI Face Finder
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 pt-4 pb-2">
                <div className="flex justify-between mb-2">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          activeStep > index
                            ? "bg-green-500 text-white"
                            : activeStep === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                        }`}
                      >
                        {activeStep > index ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          activeStep >= index ? "text-gray-900 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-start gap-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>{error}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Model Loading */}
                {!modelLoaded && (
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-center py-6">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Loading AI Models</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please wait while we initialize the face detection models
                      </p>

                      {/* Custom Progress Bar */}
                      <div className="h-2 w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${modelLoadingProgress}%` }}
                        ></div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{modelLoadingProgress}% complete</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: File Input and Preview */}
                {modelLoaded && activeStep === 0 && (
                  <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Upload a Photo with a Face</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Select an image to find similar faces in your collection
                      </p>
                    </div>

                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag
                          and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG or JPEG (max. 10MB)</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Processing */}
                {modelLoaded && activeStep === 1 && (
                  <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {selectedImage && (
                      <div className="flex flex-col items-center">
                        <div className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
                          <img
                            ref={imageRef}
                            src={selectedImage || "/placeholder.svg"}
                            alt="Selected"
                            className="max-h-64 w-auto"
                          />
                          {loading && (
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-2" />
                                <p className="text-sm font-medium">Analyzing face...</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="w-full max-w-md space-y-2">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Detecting face</span>
                            <span>Comparing</span>
                            <span>Finding matches</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={handleReset}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </button>
                          <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors disabled:opacity-50"
                          >
                            <Search className="w-4 h-4" />
                            Find Similar Faces
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Results */}
                {modelLoaded && activeStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AnimatePresence>
                      {showSuccessAnimation && (
                        <motion.div
                          className="fixed inset-0 flex items-center justify-center z-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            className="bg-green-500 text-white rounded-full p-8"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-16 h-16" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Similar Faces Found</h3>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Try Another Photo
                      </button>
                    </div>

                    {similarPhotos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarPhotos.map((photo, index) => {
                          // Sanitize similarity value before using it
                          const similarity = Number(photo.similarity)

                          return (
                            <motion.div
                              key={photo._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: index * 0.1 },
                              }}
                              className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                            >
                              <div className="relative aspect-square">
                                <img
                                  src={photo.data || "/placeholder.svg"}
                                  alt={photo.name || "Similar face"}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute top-2 right-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/70 text-white">
                                    {isNaN(similarity) ? "N/A" : similarity.toFixed(2) + "%"}
                                  </span>
                                </div>
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium truncate">
                                    {photo.name || `Match #${index + 1}`}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No similar faces found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                          We couldn't find any matching faces in your collection. Try uploading a different photo.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

