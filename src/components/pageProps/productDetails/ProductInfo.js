import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // For star icons

const ProductInfo = ({ productInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mock rating value (replace with actual rating from productInfo if available)
  const reviewsCount = 0; // Use productInfo.reviews_count if available

  const handleTryOn = () => {
    console.log(" productInfo?.item?.id : ",  productInfo?.item?.id);
    
    navigate(`/try-on`, {
      state: {
        cloth_id: productInfo?.item?.id,
      },
    });
  };

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

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name and Try On Button */}
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-4xl font-semibold">{productInfo?.productName}</h2>
        <button
          onClick={handleTryOn}
          className="w-[100px] py-2 bg-primeColor hover:bg-black duration-300 text-white text-md font-titleFont rounded-md"
        >
          Try On
        </button>
      </div>

      {/* Price */}
      <p className="text-xl font-semibold">LKR {productInfo?.price}</p>

      {/* Ratings and Reviews Count */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {renderStars(productInfo?.item?.average_rating)}
        </div>
        <p className="text-sm text-gray-600">
          ({productInfo?.item?.average_rating} out of 5,{" "}
          {productInfo?.item?.reviews_count} reviews)
        </p>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Fabric Description</p>

        <p className="text-base">
          {productInfo?.item?.description}
        </p>
      </div>
      {/* Color */}
      <p className="font-medium text-lg">
        <p className="text-sm text-gray-600">Color: {productInfo?.color}</p>
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont rounded-md"
      >
        Add to Cart
      </button>
      <div className="flex flex-row justify-between">
      {/* Categories */}
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Categories:</span>{" "}
        {productInfo?.item?.category_name}
      </p>
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Style:</span>{" "}
        {productInfo?.item?.style}
      </p>
    </div>
    </div>
  );
};

export default ProductInfo;
