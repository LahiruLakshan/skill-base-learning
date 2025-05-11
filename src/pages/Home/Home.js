import React from "react";
import Banner from "../../components/Banner/Banner";
import { Button } from "../../components/ui";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Banner />
      {/* <BannerBottom /> */}
      <Link to={"/quiz"} className="flex flex-col justify-center items-center">

            <Button className="my-4 ">Let's Start Pre Quiz</Button>
      </Link>
      
    </div>
  );
};

export default Home;
