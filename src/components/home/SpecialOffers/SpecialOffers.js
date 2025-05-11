import React, { useEffect, useState } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  spfOne,
  spfTwo,
  spfThree,
  spfFour,
} from "../../../assets/images/index";
import Slider from "react-slick";

import axios from "axios";
import { BACKEND_URL } from "../../../constants/config";
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";
const SpecialOffers = () => {
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    const fetchAllItems = async () => {
      await axios.get(`${BACKEND_URL}api/clothes-all`).then((response) => {
        console.log("response : ", response.data);
        setCurrentItems(response.data);
      });
    };
    fetchAllItems();
  }, []);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full py-16">
      <Heading heading="Special Offers" />
      <Slider {...settings}>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id} className="w-full px-2">
            <Product
              _id={item._id}
              img={item.url}
              productName={item.title}
              price={item.sale_price_amount}
              color={item.color}
              badge={item.style}
              des={item.category_name}
              item={item}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SpecialOffers;
