import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";
import { logo, logoLight } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../constants";
import Flex from "../../designLayouts/Flex";
import { Button } from "../../ui";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const Header = () => {
  const [userData, setUserData] = useState({});
  const authToken = localStorage?.getItem("authToken"); // Assuming authToken is stored in localStorage
  const uid = localStorage?.getItem("uid"); // Assuming authToken is stored in localStorage
  const userRole = authToken?.role || "user"; // Default role is 'user'

  const filteredNavBarList = navBarList.filter(
    (item) => !item.adminOnly || userRole === "admin"
  );
  const [showMenu, setShowMenu] = useState(true);
  const [sidenav, setSidenav] = useState(false);
  const [category, setCategory] = useState(false);
  const [brand, setBrand] = useState(false);
  const location = useLocation();
  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
  }, []);

  useEffect(() => {
    if (uid) {
      const fetchUser = async () => {
        try {
          const q = query(collection(db, "users"), where("id", "==", uid));

          const querySnapshot = await getDocs(q);
          const userFetchData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("setUserData : ", userFetchData);

          localStorage.setItem("level", userFetchData[0].level);
          setUserData(userFetchData[0]);
        } catch (error) {
          console.error("Error fetching userFetchData:", error);
        } finally {
        }
      };
      fetchUser();
    }
  }, [uid]);

  return (
    <div className="w-full h-50 bg-white sticky top-0 z-50 border-b-[1px] border-b-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <div>
              <Image className="w-40 object-cover" imgSrc={logo} />
            </div>
          </Link>
          <div>
            {showMenu && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center w-auto z-50 p-0 gap-2"
              >
                <>
                  <NavLink
                    className="flex font-normal hover:font-bold w-auto h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                    to={"/"}
                    state={{ data: location.pathname.split("/")[1] }}
                  >
                    <li>Home</li>
                  </NavLink>
                  {localStorage?.getItem("authToken") &&
                    userData?.level !== "None" && (
                      <NavLink
                        className="flex font-normal hover:font-bold w-auto h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                        to={"/practice-quiz"}
                        state={{ data: location.pathname.split("/")[1] }}
                      >
                        <li>Practice Quiz</li>
                      </NavLink>
                    )}

                  {localStorage?.getItem("authToken") &&
                    userData?.level !== "None" && (
                      <NavLink
                        className="flex font-normal hover:font-bold w-auto h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                        to={"/modules"}
                        state={{ data: location.pathname.split("/")[1] }}
                      >
                        <li>Modules</li>
                      </NavLink>
                    )}
                  {localStorage?.getItem("authToken") &&
                    userData?.level !== "None" && (
                      <NavLink
                        className="flex font-normal hover:font-bold w-auto h-6 justify-center items-center px-12 text-base text-[#767676] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                        to={"/dashboard"}
                        state={{ data: location.pathname.split("/")[1] }}
                      >
                        <li>Dashboard</li>
                      </NavLink>
                    )}
                </>
              </motion.ul>
            )}

            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
            />
            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-full relative"
                >
                  <div className="w-full h-full bg-primeColor p-6">
                    <img
                      className="w-28 mb-6"
                      src={logoLight}
                      alt="logoLight"
                    />
                    <ul className="text-gray-200 flex flex-col gap-2">
                      {filteredNavBarList.map((item) => (
                        <li
                          className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:underline underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                          key={item._id}
                        >
                          <NavLink
                            to={item.link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => setSidenav(false)}
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span
                    onClick={() => setSidenav(false)}
                    className="w-8 h-8 border-[1px] border-gray-300 absolute top-2 -right-10 text-gray-300 text-2xl flex justify-center items-center cursor-pointer hover:border-red-500 hover:text-red-500 duration-300"
                  >
                    <MdClose />
                  </span>
                </motion.div>
              </div>
            )}
          </div>
          {userData?.level && (
            <div className="flex flex-col  ">
              <div className=" text-grey text-sm text-center">
                Current Level
              </div>
              <div className="bg-blue-800 text-white py-3 px-5 border rounded-lg text-center">
                {userData?.level === "None" ? "-" : userData?.level}
              </div>
            </div>
          )}
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
