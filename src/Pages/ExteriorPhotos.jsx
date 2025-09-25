import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  Rocket,
  Car,
  CarFront,
  Gauge,
  Hash,
  Armchair,
  Camera,
  ArrowRight,
  ArrowLeft,
  LifeBuoy,
  CircleGauge,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadVehicleImage,
  deleteVehicleImage,
  addUploadedImage,
  removeUploadedImage,
  clearImageUploadError,
  clearImageDeleteError,
  startAuction,
  clearAuctionStartError,
} from "@/redux/slices/carDetailsAndQuestionsSlice";
import toast from "react-hot-toast";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, FileText, Shield, Clock, Loader2 } from "lucide-react";
export default function VehiclePhotos() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const questions = useSelector(
    (state) => state?.carDetailsAndQuestions?.questions
  );
  const {
    uploadedImages,
    imageUploadStatus,
    imageUploadError,
    imageDeleteStatus,
    imageDeleteError,
    auctionStartStatus,
    auctionStartError,
    auctionData,
    offer,
  } = useSelector((state) => state?.carDetailsAndQuestions);

  // Mock data and handlers for standalone usage
  const data = { photos: [] };
  const productId = useSelector(
    (state) => state?.carDetailsAndQuestions?.productId
  );
  const location = useLocation();
  const onChange = (newData) => {
    // console.log('Photos updated:', newData);
  };
  const handleStartAuction = async () => {
    if (!productId) {
      toast.error("Product ID is required to start auction");
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearAuctionStartError());
      const auction_terms_accepted = termsAccepted
        ? "accepted"
        : "not_accepted";
      // Start the auction
      const result = await dispatch(
        startAuction({ productId, auction_terms_accepted })
      ).unwrap();

      // Show success toast
      toast.success(result.message || "Auction started successfully!");

      // Navigate to review page after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Failed to start auction:", error);
      toast.error(error || "Failed to start auction. Please try again.");
    }
  };

  const onNext = () => {
    setShowTermsModal(true);
  };

  const handleModalClose = () => {
    setShowTermsModal(false);
    setTermsAccepted(false);
  };

  const handleAcceptTerms = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions to continue");
      return;
    }

    await handleStartAuction();
    setShowTermsModal(false);
  };
  const onPrev = () => {
    navigate("/auction-page");
  };

  // Check if accident is true from the offer state
  const hasAccident = offer?.isAccident === true;

  const [photos, setPhotos] = useState(data.photos || []);
  const [accidentPhotos, setAccidentPhotos] = useState([]);
  const [extraAccidentCardIds, setExtraAccidentCardIds] = useState(() => {
    if (productId) {
      return (
        JSON.parse(localStorage.getItem(`extra_accident_cards_${productId}`)) ||
        []
      );
    }
    return [];
  });
  const [uploadingMap, setUploadingMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // console.log("questions", questions);
  });

  // Load extra (optional) accident card IDs from localStorage and initialize blanks
  useEffect(() => {
    if (productId) {
      const savedIds =
        JSON.parse(localStorage.getItem(`extra_accident_cards_${productId}`)) ||
        [];
      setExtraAccidentCardIds(savedIds);
      const blankOptionals = savedIds.map((id) => ({
        id,
        label: "Accident Photo",
        icon: Camera,
        description: "Photo of accident damage",
        required: false,
        isAccident: true,
      }));
      setAccidentPhotos(blankOptionals);
    }
  }, [productId]);

  // Load persisted images from Redux state whenever uploadedImages changes
  useEffect(() => {
    console.log("Redux uploadedImages changed:", uploadedImages);

    // Separate regular photos from accident photos
    const regularPhotos = (uploadedImages || []).filter(
      (img) => !img.metaKey?.includes("accident")
    );
    const accidentPhotosFromRedux = (uploadedImages || []).filter((img) =>
      img.metaKey?.includes("accident")
    );

    // Convert Redux images to component format
    const convertedRegularPhotos = regularPhotos.map((img) => ({
      id: `${img.metaKey}_${img.attachmentId}`,
      file: null,
      url: img.imageUrl,
      serverUrl: img.imageUrl,
      requirement: img.metaKey
        ?.replace("image_image_", "")
        .replace("_view", ""),
      timestamp: new Date(),
      attachmentId: img.attachmentId,
      metaKey: img.metaKey,
      uploaded: true,
    }));

    const convertedAccidentPhotos = accidentPhotosFromRedux.map((img) => ({
      id: img.metaKey?.replace("image_image_", "").replace("_view", ""),
      file: null,
      url: img.imageUrl,
      serverUrl: img.imageUrl,
      requirement: img.metaKey
        ?.replace("image_image_", "")
        .replace("_view", ""),
      timestamp: new Date(),
      attachmentId: img.attachmentId,
      metaKey: img.metaKey,
      uploaded: true,
      label: "Accident Photo",
      icon: Camera,
      description: "Photo of accident damage",
      required: img.metaKey?.includes("accident_mandatory_"),
      isAccident: true,
    }));

    setPhotos(convertedRegularPhotos);

    // Merge converted accident photos with existing (blanks preserved)
    setAccidentPhotos((prev) => {
      let newList = prev.map((p) => {
        const match = convertedAccidentPhotos.find((u) => u.id === p.id);
        if (match) {
          return { ...p, ...match, url: match.url, uploaded: true };
        }
        return p;
      });

      // Add any new uploaded that weren't in prev
      const added = convertedAccidentPhotos.filter(
        (u) => !prev.some((p) => p.id === u.id)
      );
      newList = [...newList, ...added];

      // Ensure required accident card exists if hasAccident
      const hasRequired = newList.some((p) => p.required);
      if (hasAccident && !hasRequired) {
        const newReqId = `accident_mandatory_${Date.now()}`;
        newList.push({
          id: newReqId,
          label: "Accident Photo (Required)",
          icon: Camera,
          description: "Photo of accident damage",
          required: true,
          isAccident: true,
        });
      }

      return newList;
    });
  }, [uploadedImages, hasAccident]);

  const photoRequirements = [
    {
      id: "front",
      label: "Front View",
      icon: CarFront,
      description: "Full front view of the vehicle",
      required: true,
      tip: "Take the photo in daylight with the whole front clearly visible.",
    },
    {
      id: "rear",
      label: "Rear View",
      icon: Car,
      description: "Full rear view of the vehicle",
      required: true,
      tip: "Ensure the entire rear is visible and avoid dark shadows.",
    },
    {
      id: "side_driver",
      label: "Driver Side",
      icon: ArrowRight,
      description: "Complete driver side profile",
      required: true,
      tip: "Stand far enough so the whole side fits clearly in the frame.",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Gauge,
      description: "Front dashboard and controls",
      required: true,
      tip: "Switch on ignition so dashboard details are clearly lit.",
    },
    {
      id: "side_passenger",
      label: "Passenger Side",
      icon: ArrowLeft,
      description: "Complete passenger side profile",
      required: false,
      tip: "Capture the full side without cutting off wheels or mirrors.",
    },
    {
      id: "odometer",
      label: "Odometer",
      icon: CircleGauge,
      description: "Mileage reading clearly visible",
      required: false,
      tip: "Focus closely so the numbers are sharp and readable.",
    },
    {
      id: "wheels",
      label: "Wheels & Tires",
      icon: LifeBuoy,
      description: "Close-up of wheels and tires",
      required: false,
      tip: "Make sure tread patterns and rims are in clear focus.",
    },
    {
      id: "front_seats",
      label: "Front Seats",
      icon: Armchair,
      description: "Front seats condition",
      required: false,
      tip: "Adjust lighting to avoid shadows on seat fabric.",
    },
  ];

  const requiredPhotos = photoRequirements.filter((req) => req.required);
  const totalRequired = requiredPhotos.length + (hasAccident ? 1 : 0); // Include mandatory accident photo

  // Count uploaded required photos more accurately
  const uploadedRequiredCount =
    photos.filter(
      (photo) =>
        requiredPhotos.some((req) => req.id === photo.requirement) &&
        photo.uploaded
    ).length +
    (hasAccident && accidentPhotos.some((p) => p.uploaded && p.required)
      ? 1
      : 0);

  const isComplete = uploadedRequiredCount >= totalRequired;

  const handleSinglePhotoUpload = async (file, id) => {
    console.log("=== handleSinglePhotoUpload START ===");
    console.log("Upload parameters:", { file, id, productId });

    if (!productId) {
      console.error("Product ID is required for image upload");
      return;
    }

    console.log("Setting upload state for photo:", id);
    setUploadingMap((prev) => ({ ...prev, [id]: true }));
    setProgressMap((prev) => ({ ...prev, [id]: 0 }));

    try {
      // Create image name based on requirement ID
      const imageName = `image_${id}_view`;
      console.log("Created image name:", imageName);

      // Progress callback for chunked uploads
      const onProgress = (progress) => {
        console.log(`Progress update for ${id}:`, progress);
        setProgressMap((prev) => ({ ...prev, [id]: progress }));
      };

      console.log("Dispatching uploadVehicleImage thunk...");
      // Use the Redux thunk for image upload with progress tracking
      const result = await dispatch(
        uploadVehicleImage({
          file,
          productId,
          imageName,
          onProgress,
        })
      ).unwrap();

      console.log("Image upload successful:", result);

      // Note: Image is automatically added to Redux state via uploadVehicleImage.fulfilled
      // No need to manually add to local state as it will be loaded from Redux in useEffect

      // Show compression info if significant compression occurred
      if (
        result.compressedSize &&
        result.originalSize &&
        result.compressedSize < result.originalSize
      ) {
        toast.success(`Image uploaded successfully`);
      }
    } catch (error) {
      console.error("=== Image upload failed ===");
      console.error("Error details:", {
        error,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      console.error("File details at error time:", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      // Show error to user
      toast.error(`Failed to upload image: ${error.message || error}`);
    } finally {
      console.log("Cleaning up upload state for photo:", id);
      setUploadingMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setProgressMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      console.log("=== handleSinglePhotoUpload END ===");
    }
  };

  const handleFileUpload = async (files, requirementId) => {
    const tasks = Array.from(files).map((file) =>
      handleSinglePhotoUpload(file, requirementId)
    );
    await Promise.all(tasks);
  };

  const handleDrop = (e, requirementId) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, requirementId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removePhoto = async (photoId, isAccidentPhoto = false) => {
    try {
      // Find the photo to get attachment ID
      const photoToDelete = isAccidentPhoto
        ? accidentPhotos.find((photo) => photo.id === photoId)
        : photos.find((photo) => photo.id === photoId);

      if (!photoToDelete) {
        console.error("Photo not found for deletion");
        return;
      }

      // Set deleting state for this specific photo
      setUploadingMap((prev) => ({ ...prev, [photoId]: true }));

      // If photo was uploaded to server, delete it via API
      if (photoToDelete.attachmentId) {
        console.log("Deleting image from server:", photoToDelete.attachmentId);

        const result = await dispatch(
          deleteVehicleImage({
            attachmentId: photoToDelete.attachmentId,
          })
        ).unwrap();

        console.log("Image delete successful:", result);
      }

      // Remove from Redux store
      dispatch(removeUploadedImage(photoToDelete.attachmentId));

      // For accident photos: handle required vs optional differently
      if (isAccidentPhoto) {
        if (photoToDelete.required) {
          // For required accident photo, clear image data but keep the card
          setAccidentPhotos((prev) =>
            prev.map((p) =>
              p.id === photoId
                ? {
                    ...p,
                    url: null,
                    serverUrl: null,
                    file: null,
                    attachmentId: null,
                    uploaded: false,
                  }
                : p
            )
          );
        } else {
          // For optional accident photo, remove both image and card
          setAccidentPhotos((prev) => prev.filter((p) => p.id !== photoId));
          setExtraAccidentCardIds((prev) => {
            const newIds = prev.filter((id) => id !== photoId);
            if (productId) {
              localStorage.setItem(
                `extra_accident_cards_${productId}`,
                JSON.stringify(newIds)
              );
            }
            return newIds;
          });
        }
      }
    } catch (error) {
      console.error("Image delete failed:", error);
      // Still remove from Redux store even if API call failed
      if (photoToDelete && photoToDelete.attachmentId) {
        dispatch(removeUploadedImage(photoToDelete.attachmentId));
      }
      // For accident photos: handle required vs optional differently
      if (isAccidentPhoto) {
        if (photoToDelete.required) {
          // For required accident photo, clear image data but keep the card
          setAccidentPhotos((prev) =>
            prev.map((p) =>
              p.id === photoId
                ? {
                    ...p,
                    url: null,
                    serverUrl: null,
                    file: null,
                    attachmentId: null,
                    uploaded: false,
                  }
                : p
            )
          );
        } else {
          // For optional accident photo, remove both image and card
          setAccidentPhotos((prev) => prev.filter((p) => p.id !== photoId));
          setExtraAccidentCardIds((prev) => {
            const newIds = prev.filter((id) => id !== photoId);
            if (productId) {
              localStorage.setItem(
                `extra_accident_cards_${productId}`,
                JSON.stringify(newIds)
              );
            }
            return newIds;
          });
        }
      }
      // Show error to user
      toast.error(
        `Failed to delete image from server: ${error}. Image removed locally.`
      );
    } finally {
      // Clear the deleting state for this specific photo
      setUploadingMap((prev) => {
        const next = { ...prev };
        delete next[photoId];
        return next;
      });
    }
  };

  const addAccidentPhotoCard = () => {
    const newId = `accident_${Date.now()}`;
    const newCard = {
      id: newId,
      label: "Accident Photo",
      icon: Camera,
      description: "Photo of accident damage",
      required: false,
      isAccident: true,
    };
    setAccidentPhotos((prev) => [...prev, newCard]);
    setExtraAccidentCardIds((prev) => {
      const newIds = [...prev, newId];
      if (productId) {
        localStorage.setItem(
          `extra_accident_cards_${productId}`,
          JSON.stringify(newIds)
        );
      }
      return newIds;
    });
  };

  useEffect(() => {
    onChange({ photos: [...photos, ...accidentPhotos.filter((p) => p.url)] });
  }, [photos, accidentPhotos]);

  const progress = Math.round((uploadedRequiredCount / totalRequired) * 100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 pt-12 md:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-6 font-sans tracking-tight"
        >
          Upload Your Vehicle Photos
        </motion.h1>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border-2 border-[#f6851f]/20 rounded-2xl p-6 mb-10 bg-white/90 shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm sm:text-md lg:text-lg font-semibold text-slate-800">
              Required Photos: {uploadedRequiredCount} of {totalRequired}
            </span>
            <span className="text-sm sm:text-md lg:text-lg font-semibold text-[#f6851f]">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-[#f6851f] to-[#e63946] h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Image Upload Error Display */}
        {imageUploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">
                Image Upload Failed
              </p>
              <p className="text-sm text-red-600">{imageUploadError}</p>
            </div>
            <button
              onClick={() => dispatch(clearImageUploadError())}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Image Delete Error Display */}
        {imageDeleteError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">
                Image Delete Failed
              </p>
              <p className="text-sm text-red-600">{imageDeleteError}</p>
            </div>
            <button
              onClick={() => dispatch(clearImageDeleteError())}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Auction Start Error Display */}
        {auctionStartError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">
                Auction Start Failed
              </p>
              <p className="text-sm text-red-600">{auctionStartError}</p>
            </div>
            <button
              onClick={() => dispatch(clearAuctionStartError())}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Photo Requirements Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 font-sans">
            Required & Optional Photos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {photoRequirements.map((photo, index) => {
              const uploadedPhoto = photos.find(
                (p) => p.requirement === photo.id
              );
              const hasPhoto = !!uploadedPhoto;
              const isUploadingThisPhoto = !!uploadingMap[photo.id];

              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`relative rounded-2xl overflow-hidden shadow-md backdrop-blur-sm bg-white/80 transition-all duration-300 ${
                    photo.required
                      ? hasPhoto
                        ? "border-2 border-green-300/50 bg-green-50/50"
                        : "border-2 border-[#f6851f]/30"
                      : hasPhoto
                      ? "border-2 border-green-300/50 bg-green-50/50"
                      : "border-2 border-slate-200/50 opacity-90"
                  } hover:border-[#f6851f]/50 hover:shadow-lg hover:bg-orange-50/30`}
                >
                  {isUploadingThisPhoto ? (
                    <div className="aspect-square sm:aspect-[4/3] lg:aspect-square flex flex-col items-center justify-center p-5 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-10 h-10 border-4 border-[#f6851f] border-t-transparent rounded-full mb-4"
                      />
                      <p className="text-sm font-medium text-slate-800">
                        Uploading...
                      </p>
                      <div className="w-full bg-slate-200/50 rounded-full h-2 mt-3">
                        <motion.div
                          className="bg-[#f6851f] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressMap[photo.id] || 0}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {progressMap[photo.id] || 0}% complete
                      </p>
                      {progressMap[photo.id] > 0 &&
                        progressMap[photo.id] < 100 && (
                          <p className="text-xs text-slate-500 mt-1">
                            Chunked upload in progress...
                          </p>
                        )}
                    </div>
                  ) : hasPhoto ? (
                    <div className="relative group aspect-square">
                      <img
                        src={uploadedPhoto.url}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />

                      {/* Mobile delete button - always visible in top-right corner */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(uploadedPhoto.id);
                        }}
                        disabled={!!uploadingMap[uploadedPhoto.id]}
                        className="absolute top-2 right-2 sm:hidden bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation z-10"
                      >
                        {uploadingMap[uploadedPhoto.id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>

                      {/* Desktop delete button - hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(uploadedPhoto.id);
                          }}
                          disabled={!!uploadingMap[uploadedPhoto.id]}
                          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingMap[uploadedPhoto.id] ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                        <div className="flex items-center space-x-2 text-white">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium">
                            {photo.label}
                          </span>
                          {uploadedPhoto.uploaded && (
                            <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                              Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square sm:aspect-[4/3] lg:aspect-square flex flex-col items-center justify-center p-5 text-center group">
                      <div className="w-16 h-16 sm:w-14 sm:h-14 lg:w-12 lg:h-12 mb-3 text-slate-400 group-hover:text-[#f6851f] transition-colors flex items-center justify-center">
                        <photo.icon className="w-10 h-10 sm:w-9 sm:h-9 lg:w-8 lg:h-8" />
                      </div>
                      <p className="text-sm sm:text-sm lg:text-sm font-semibold text-slate-800 mb-2">
                        {photo.label}
                      </p>
                      <div className="border-2 border-slate-300 p-2 sm:p-3 lg:p-2 rounded-md sm:h-36 lg:h-28 flex flex-col items-center justify-center">
                        <button
                          onClick={() => {
                            document
                              .getElementById(`photo-upload-${photo.id}`)
                              .click();
                          }}
                          className="cursor-pointer w-full inline-flex items-center justify-center h-12 sm:h-14 lg:h-12 px-3 rounded-md text-black border-slate-200 border-2 text-sm font-medium transition-colors duration-200 "
                        >
                          Upload
                        </button>
                        <p className="text-xs sm:text-xs lg:text-xs mt-4 text-slate-500">
                          {photo.tip}
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => {
                      console.log("File input changed:", e.target.files);
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        console.log("Selected file details:", {
                          name: file.name,
                          type: file.type,
                          size: file.size,
                          lastModified: file.lastModified,
                          webkitRelativePath: file.webkitRelativePath,
                        });

                        // Validate file type
                        const allowedTypes = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ];
                        const allowedExtensions = [
                          "jpg",
                          "jpeg",
                          "png",
                          "gif",
                          "webp",
                        ];
                        const fileTypeLower = file.type.toLowerCase();
                        const fileExtension = file.name
                          .split(".")
                          .pop()
                          ?.toLowerCase();
                        const isValidType =
                          allowedTypes.includes(fileTypeLower);
                        const isValidExtension =
                          allowedExtensions.includes(fileExtension);

                        console.log("File type validation:", {
                          originalType: file.type,
                          lowerType: fileTypeLower,
                          allowedTypes,
                          isValidType,
                          fileExtension,
                          allowedExtensions,
                          isValidExtension,
                          finalValidation: isValidType || isValidExtension,
                        });

                        if (!isValidType && !isValidExtension) {
                          console.error(
                            "File type validation failed in component:",
                            {
                              fileType: file.type,
                              fileName: file.name,
                              fileExtension: fileExtension,
                              allowedTypes,
                              allowedExtensions,
                              mimeTypeValid: isValidType,
                              extensionValid: isValidExtension,
                            }
                          );
                          toast.error(
                            "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
                          );
                          e.target.value = ""; // Clear input value
                          return;
                        }

                        console.log(
                          "File validation passed, proceeding with upload..."
                        );
                        handleSinglePhotoUpload(file, photo.id);
                        e.target.value = ""; // Clear input value to allow re-uploading same file
                      }
                    }}
                    className="hidden"
                    id={`photo-upload-${photo.id}`}
                    disabled={!!uploadingMap[photo.id]}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Accident Photos Section */}
        {hasAccident && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
              <h2 className="text-xl  sm:text-2xl font-semibold text-slate-800 font-sans">
                Accident Photos
              </h2>
              <motion.button
                onClick={addAccidentPhotoCard}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-base sm:text-lg">+</span>
                <span className="hidden sm:inline">Add Accident Photo</span>
                <span className="sm:hidden">Add Photo</span>
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {accidentPhotos.map((photo, index) => {
                const uploadedPhoto = accidentPhotos.find(
                  (p) => p.id === photo.id
                );
                const hasPhoto = !!uploadedPhoto?.url;
                const isUploadingThisPhoto = !!uploadingMap[photo.id];

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`relative rounded-2xl overflow-hidden shadow-md backdrop-blur-sm bg-white/80 transition-all duration-300 cursor-pointer ${
                      photo.required
                        ? hasPhoto
                          ? "border-2 border-green-300/50 bg-green-50/50"
                          : "border-2 border-[#f6851f]/30"
                        : hasPhoto
                        ? "border-2 border-green-300/50 bg-green-50/50"
                        : "border-2 border-slate-200/50 hover:border-[#f6851f]/50 hover:bg-orange-50/30"
                    } hover:shadow-lg`}
                    onClick={() => {
                      if (!hasPhoto && !uploadingMap[photo.id]) {
                        document
                          .getElementById(`photo-upload-${photo.id}`)
                          .click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, photo.id)}
                  >
                    {isUploadingThisPhoto ? (
                      <div className="aspect-square flex flex-col items-center justify-center p-5 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-10 h-10 border-4 border-[#f6851f] border-t-transparent rounded-full mb-4"
                        />
                        <p className="text-sm font-medium text-slate-800">
                          Uploading...
                        </p>
                        <div className="w-full bg-slate-200/50 rounded-full h-2 mt-3">
                          <motion.div
                            className="bg-[#f6851f] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${progressMap[photo.id] || 0}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {progressMap[photo.id] || 0}% complete
                        </p>
                        {progressMap[photo.id] > 0 &&
                          progressMap[photo.id] < 100 && (
                            <p className="text-xs text-slate-500 mt-1">
                              Chunked upload in progress...
                            </p>
                          )}
                      </div>
                    ) : hasPhoto ? (
                      <div className="relative group aspect-square">
                        <img
                          src={uploadedPhoto.url}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                        />

                        {/* Mobile delete button - always visible in top-right corner */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(uploadedPhoto.id, true);
                          }}
                          disabled={!!uploadingMap[uploadedPhoto.id]}
                          className="absolute top-2 right-2 sm:hidden bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation z-10"
                        >
                          {uploadingMap[uploadedPhoto.id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>

                        {/* Desktop delete button - hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(uploadedPhoto.id, true);
                            }}
                            disabled={!!uploadingMap[uploadedPhoto.id]}
                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingMap[uploadedPhoto.id] ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                          <div className="flex items-center space-x-2 text-white">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium">
                              {photo.label}
                            </span>
                            {uploadedPhoto.uploaded && (
                              <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
                                Uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square sm:aspect-[4/3] lg:aspect-square flex flex-col items-center justify-center p-5 text-center group">
                        <div className="w-16 h-16 sm:w-14 sm:h-14 lg:w-12 lg:h-12 mb-3 text-slate-400 group-hover:text-[#f6851f] transition-colors flex items-center justify-center">
                          <photo.icon className="w-10 h-10 sm:w-9 sm:h-9 lg:w-8 lg:h-8" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mb-2">
                          {photo.label}
                        </p>
                        <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-9 lg:h-9 rounded-full border-2 border-dashed border-slate-300 group-hover:border-[#f6851f] group-hover:bg-orange-50/20 flex items-center justify-center transition-all">
                          <span className="text-slate-400 group-hover:text-[#f6851f] text-2xl sm:text-xl lg:text-xl">
                            +
                          </span>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => {
                        console.log(
                          "Accident photo file input changed:",
                          e.target.files
                        );
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          console.log("Selected accident photo file details:", {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            lastModified: file.lastModified,
                            webkitRelativePath: file.webkitRelativePath,
                          });

                          // Validate file type
                          const allowedTypes = [
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                          ];
                          const allowedExtensions = [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "webp",
                          ];
                          const fileTypeLower = file.type.toLowerCase();
                          const fileExtension = file.name
                            .split(".")
                            .pop()
                            ?.toLowerCase();
                          const isValidType =
                            allowedTypes.includes(fileTypeLower);
                          const isValidExtension =
                            allowedExtensions.includes(fileExtension);

                          console.log("Accident photo file type validation:", {
                            originalType: file.type,
                            lowerType: fileTypeLower,
                            allowedTypes,
                            isValidType,
                            fileExtension,
                            allowedExtensions,
                            isValidExtension,
                            finalValidation: isValidType || isValidExtension,
                          });

                          if (!isValidType && !isValidExtension) {
                            console.error(
                              "File type validation failed in accident photos:",
                              {
                                fileType: file.type,
                                fileName: file.name,
                                fileExtension: fileExtension,
                                allowedTypes,
                                allowedExtensions,
                                mimeTypeValid: isValidType,
                                extensionValid: isValidExtension,
                              }
                            );
                            toast.error(
                              "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
                            );
                            e.target.value = ""; // Clear input value
                            return;
                          }

                          console.log(
                            "Accident photo file validation passed, proceeding with upload..."
                          );
                          handleSinglePhotoUpload(file, photo.id);
                          e.target.value = ""; // Clear input value to allow re-uploading same file
                        }
                      }}
                      className="hidden"
                      id={`photo-upload-${photo.id}`}
                      disabled={!!uploadingMap[photo.id]}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200/50"
        >
          <motion.button
            onClick={onPrev}
            className="cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200/50 bg-white/90 px-6 text-sm font-semibold text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-slate-50/80 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
          <motion.button
            onClick={() => {
              onChange({
                photos: [...photos, ...accidentPhotos.filter((p) => p.url)],
              });
              onNext();
            }}
            disabled={!isComplete || auctionStartStatus === "starting"}
            className={`cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all ${
              !isComplete || auctionStartStatus === "starting"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            whileHover={
              isComplete && auctionStartStatus !== "starting"
                ? { scale: 1.03 }
                : {}
            }
            whileTap={
              isComplete && auctionStartStatus !== "starting"
                ? { scale: 0.97 }
                : {}
            }
          >
            {auctionStartStatus === "starting" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Starting Auction...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-2xl h-[82vh] lg:h-[75vh]  overflow-y-auto rounded-2xl shadow-xl p-0 overflow-hidden bg-white">
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                Your Car is Ready for Auction
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-2">
                Please review and accept the terms before starting your auction
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              {[
                {
                  title: "Auction Agreement",
                  content:
                    "Once you confirm, your vehicle details will be shared with verified dealerships across the Amacar platform. Dealers will begin bidding in real time based on your car’s information and photos",
                },
                {
                  title: "Vehicle Condition",
                  content:
                    "You confirm that the information and photos provided are accurate and complete.",
                },
                {
                  title: "Final appraisal",
                  content:
                    "This offer is an estimated online value, Participating Amacar dealers bid to win your car. Final values are subject to dealer inspection and may be adjusted. Amacar is not responsible if a dealer modifies or declines an offer after final appraisal. Dealers pay a fee to participate in this program. Terms and conditions apply.",
                },
              ].map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                >
                  <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {term.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {term.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          {/* Modal Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="terms-checkbox"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  I have read and agree to the <Link to={'/terms-of-service'} className="no-underline font-bold text-[#f6851f]">Terms & Conditions</Link>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleModalClose}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptTerms}
                  disabled={!termsAccepted || auctionStartStatus === "starting"}
                  className={`w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all ${
                    termsAccepted && auctionStartStatus !== "starting"
                      ? "bg-gradient-to-r from-[#f6851f] to-[#e63946] hover:from-orange-600 hover:to-red-600 shadow-lg"
                      : "bg-slate-400 cursor-not-allowed"
                  }`}
                >
                  {auctionStartStatus === "starting" ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Rocket className="w-4 h-4" />
                      <p>Start</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
