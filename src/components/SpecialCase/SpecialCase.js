import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { MdSwitchAccount } from "react-icons/md";
import { useSelector } from "react-redux";

const SpecialCase = () => {
  const uid = localStorage?.getItem("uid");
  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
      {uid ? (
        <Link to="/profile">
          <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
            <div className="flex justify-center items-center">
              <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

              <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
            </div>
            <p className="text-xs font-semibold font-titleFont">Profile</p>
          </div>
        </Link>
      ) : (
        <Link to="/signin">
          <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
            <div className="flex justify-center items-center">
              <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />

              <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
            </div>
            <p className="text-xs font-semibold font-titleFont">Profile</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SpecialCase;
