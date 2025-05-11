import React from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);

  const navigate = useNavigate();
  const productItem = props;
  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: productItem,
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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 min-h-[300px]">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Image
          className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
          imgSrc={props.img}
        />
        {/* Badge */}
        {props.badge && (
          <div className="absolute top-4 left-4">
            <Badge text={props.badge} />
          </div>
        )}
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center">
          <ul className="w-full bg-white bg-opacity-90 backdrop-blur-sm p-4 space-y-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <li
              onClick={() =>
                dispatch(
                  addToCart({
                    _id: props._id,
                    name: props.productName,
                    quantity: 1,
                    image: props.img,
                    badge: props.badge,
                    price: props.price,
                    colors: props.color,
                  })
                )
              }
              className="flex items-center justify-between text-gray-700 hover:text-[#2365ac] cursor-pointer transition-colors duration-200"
            >
              <span>Add to Cart</span>
              <FaShoppingCart className="text-lg" />
            </li>
            <li
              onClick={handleProductDetails}
              className="flex items-center justify-between text-gray-700 hover:text-[#2365ac] cursor-pointer transition-colors duration-200"
            >
              <span>View Details</span>
              <MdOutlineLabelImportant className="text-lg" />
            </li>
            <li className="flex items-center justify-between text-gray-700 hover:text-[#2365ac] cursor-pointer transition-colors duration-200">
              <span>Add to Wishlist</span>
              <BsSuitHeartFill className="text-lg" />
            </li>
          </ul>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 h-[140px]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
            {props.productName}
          </h2>
          <p className="text-lg font-semibold text-[#2365ac]">LKR{props.price}</p>
        </div>
        <p className="text-sm text-gray-500 mt-1">{props.color}</p>

        {/* Ratings and Reviews Count */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">{renderStars(props?.item?.average_rating)}</div>
          <p className="text-sm text-gray-600">
            ({props?.item?.average_rating} out of 5, {props?.item?.reviews_count} reviews)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;