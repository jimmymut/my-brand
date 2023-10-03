import { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import Loader from "../components/Loader";
import { ToastContainer } from "react-toastify";
import { logoutFunc, getUserProfile } from "../helpers/auth";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    getUserProfile(setLoading, setUserProfile, setIsLoggedIn);
  }, [setLoading, setUserProfile, setIsLoggedIn]);
  return (
    <div>
      {loading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <ToastContainer />
          <div className="landing-main">
            <HomeHeader
              isLoggedIn={isLoggedIn}
              logout={() => logoutFunc(setUserProfile, setIsLoggedIn)}
              userName={userProfile?.firstName}
              proPic={userProfile?.proPic}
            />
            <div className="landing-designdiv">
              <h1>
                Coding challenge improves
                <br />
                coding muscles
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
