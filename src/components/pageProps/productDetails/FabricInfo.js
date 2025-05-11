import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // For star icons
import axios from "axios";
import { BACKEND_URL } from "../../../constants/config";

const FabricInfo = ({ productInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fabricReview, setFabricReview] = useState("");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    textureFeel: "",
    breathabilityComfort: "",
    durabilityStrength: "",
    stretchabilityFlexibility: "",
    careMaintenance: "",
  });

  // Mock rating value (replace with actual rating from productInfo if available)
  const reviewsCount = 0; // Use productInfo.reviews_count if available

  const handleTryOn = () => {
    navigate(`/try-on`, {
      state: {
        cloth_id: productInfo?.item?.id,
      },
    });
  };

  const fetchAllItems = async () => {
    try {
      await axios
        .get(`${BACKEND_URL}api/fabric-summary/${productInfo?.item?.fabric_name}/`)
        .then((response) => {
          console.log("response : ", response.data);
          setFabricReview(response.data.combined_review);
        })
        .catch((err) => setFabricReview(err.response.data.message));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (productInfo?.item?.fabric_name) {
      fetchAllItems();
    }
  }, [productInfo?.item?.fabric_name]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Empty stars
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Handle input change for review fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitReview = async () => {
    try {
      // Concatenate all review fields into a single string
      const reviewText = `${reviewData.textureFeel} ${reviewData.breathabilityComfort} ${reviewData.durabilityStrength} ${reviewData.stretchabilityFlexibility} ${reviewData.careMaintenance}`;
  
      // Submit review data to the backend
      const response = await axios.post(`${BACKEND_URL}/api/add-fabric-review/`, {
        fabric_name: productInfo?.item?.fabric_name,
        review_text: reviewText, // Send the concatenated review text
      });
  
      console.log("Review submitted:", response.data);
      setIsReviewPopupOpen(false); // Close the popup
      setReviewData({
        textureFeel: "",
        breathabilityComfort: "",
        durabilityStrength: "",
        stretchabilityFlexibility: "",
        careMaintenance: "",
      }); // Reset form
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name and Try On Button */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Name</p>
        <h2 className="text-3xl font-semibold">
          {productInfo?.item?.fabric_name}
        </h2>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Description</p>
        <p className="text-md ">{productInfo?.item?.fabric_description}</p>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Review</p>
        <p className="text-md ">{fabricReview}</p>
      </div>


      {/* Add a Review Button */}
      <button
        onClick={() => setIsReviewPopupOpen(true)}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont rounded-md"
      >
        Add a Review
      </button>

      {/* Review Prompt */}
      {reviewsCount === 0 && (
        <p className="text-sm text-gray-600">Be the first to leave a review.</p>
      )}

      {/* Review Popup */}
      {isReviewPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add a Review</h2>

            {/* Texture & Feel */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Texture & Feel
              </label>
              <textarea
                name="textureFeel"
                value={reviewData.textureFeel}
                onChange={handleInputChange}
                placeholder="Soft, crisp, smooth, rough, breathable, silky, coarse, etc."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primeColor"
                rows={3}
              />
            </div>

            {/* Breathability & Comfort */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Breathability & Comfort
              </label>
              <textarea
                name="breathabilityComfort"
                value={reviewData.breathabilityComfort}
                onChange={handleInputChange}
                placeholder="How well it allows air circulation (important for warm climates)."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primeColor"
                rows={3}
              />
            </div>

            {/* Durability & Strength */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Durability & Strength
              </label>
              <textarea
                name="durabilityStrength"
                value={reviewData.durabilityStrength}
                onChange={handleInputChange}
                placeholder="Whether it's prone to wear & tear or strong and long-lasting."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primeColor"
                rows={3}
              />
            </div>

            {/* Stretchability & Flexibility */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Stretchability & Flexibility
              </label>
              <textarea
                name="stretchabilityFlexibility"
                value={reviewData.stretchabilityFlexibility}
                onChange={handleInputChange}
                placeholder="Whether it has natural elasticity (e.g., spandex blend) or is stiff."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primeColor"
                rows={3}
              />
            </div>

            {/* Care & Maintenance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Care & Maintenance
              </label>
              <textarea
                name="careMaintenance"
                value={reviewData.careMaintenance}
                onChange={handleInputChange}
                placeholder="Machine washable or dry-clean only? Does it shrink, fade, or require special care?"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primeColor"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSubmitReview}
                className="flex-1 py-2 bg-primeColor text-white rounded-lg hover:bg-black"
              >
                Submit
              </button>
              <button
                onClick={() => setIsReviewPopupOpen(false)}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FabricInfo;