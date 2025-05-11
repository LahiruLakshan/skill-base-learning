import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axios from "axios";
import { BACKEND_URL } from "../../../constants/config";

const NewArrivals = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [style, setStyle] = useState("");

    useEffect(() => {
      const fetchAllItems = async () => {
        await axios.get(`${BACKEND_URL}api/trending-items`).then((response) =>{
          console.log("response : ", response.data);
          setCurrentItems(response.data.trending_items)
          setStyle(response.data.trending_style)
        })
      }
      fetchAllItems()
    },[])
  


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
      {style && <Heading heading="Trending Clothes" />}
      <Slider {...settings}>
        {
          currentItems.map((item) =>{
            <div className="px-2">
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
          })
        }

      </Slider>
    </div>
  );
};

export default NewArrivals;
