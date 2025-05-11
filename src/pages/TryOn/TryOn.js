import React, { useEffect, useRef, useState } from "react";
import CameraKitComponent from "../../components/CameraKitComponent/CameraKitComponent";
import axios from "axios";
import { BACKEND_URL } from "../../constants/config";
import { useLocation } from "react-router-dom";

const TryOn = () => {
  const location = useLocation();  
  const webcamRef = useRef(null);
  const [recommendSize, setRecommendSize] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const[lensId, setLensId] = useState(null);

  const capture = () => {
    console.log("capturing");
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    uploadImageToCloudinary(imageSrc);
  };

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          capture();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const uploadImageToCloudinary = async (image) => {
    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      if (data.url) {
        setCloudinaryUrl(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const getClothDetail = async (size) => {
    try {
      await axios
        .get(`${BACKEND_URL}api/cloth/${location.state.cloth_id}/`)
        .then((response) => {
          console.log("response single cloth : ", response.data);
          if (size === "L") {
            setLensId(response.data.lens_id_l)
          }
          else if (size === "M") {
            setLensId(response.data.lens_id_m)
          }
          else if (size === "S") {
            setLensId(response.data.lens_id_s)
          }
          
        })
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const fetchAllItems = async () => {
      const authToken = JSON.parse(localStorage.getItem("authToken"));

      try {
        const response = await axios
          .post(
            `${BACKEND_URL}api/recommend-size/`,
            {
              user_id: authToken.user_id,
              cloth_id: location.state.cloth_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response.data.recommended_size);
            getClothDetail(response.data.recommended_size)
            setRecommendSize(response.data.recommended_size);});

        console.log("response : ", response.data.recommended_size);
      } catch (err) {
        setRecommendSize("L");
      }
    };
    fetchAllItems();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Camera Container */}
      {/* Webcam */}
      {/* <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg shadow-lg"
        /> */}
      {recommendSize && (
        <div className="flex gap-4 mb-8 flex-wrap justify-center bg-white shadow-lg p-6 rounded-lg absolute top-[300px] left-[250px]">
          <h3
            disabled={!!imgSrc}
            className="px-6 py-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Recommend Size : {recommendSize}
          </h3>
        </div>
      )}
      {/* CameraKitComponent */}
      {recommendSize && (
        <div className="w-[80vw] h-[90vh]">
         {lensId && <CameraKitComponent lens_id={lensId}/>}
        </div>
      )}
    </div>
  );
};

export default TryOn;
