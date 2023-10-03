import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import htmlIcon from "../images/html-icon.png";
import cssIcon from "../images/css-icon.png";
import jsIcon from "../images/javascript-icon.png";
import nodeIcon from "../images/icons8-nodejs-48.png";
import expressIcon from "../images/express-icon.png";
import mongoIcon from "../images/mongodb-icon.png";
import djangoIcon from "../images/django-icon.png";
import figmaIcon from "../images/figma-icon.png";
import { logoutFunc, getUserProfile } from "../helpers/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css/bundle";

const Skills = () => {
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
          <Header
            isLoggedIn={isLoggedIn}
            logout={() =>
              logoutFunc(setUserProfile, setIsLoggedIn)
            }
            userName={userProfile?.firstName}
            proPic={userProfile?.proPic}
          />
          <h1 id="skills-header">Skills</h1>
          <Swiper
           spaceBetween={30}
           centeredSlides={true}
           autoplay={{
             delay: 2500,
             disableOnInteraction: false,
           }}
           pagination={{
             clickable: true,
           }}
           navigation={true}
           modules={[Autoplay, Pagination, Navigation]}
            className="swiper mySwiper"
          >
            <SwiperSlide>
              <div className="technical-skills" id="skills-page1">
                <div className="html-card">
                  <img src={htmlIcon} alt="html icon" />
                  <h4>HTML</h4>
                  <p>Very good at html structuring.</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page1">
                <div className="css-card">
                  <img src={cssIcon} alt="css icon" />
                  <h4>CSS</h4>
                  <p>
                    I am good css styling and keep on learning to keep my css
                    tricks on top level.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page1">
                <div className="js-card">
                  <img src={jsIcon} alt="JavaScript icon" />
                  <h4>JavaScript</h4>
                  <p>
                    Good in DOM manipulations and JavaScript in general for
                    backend.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page2">
                <div className="node-card">
                  <img src={nodeIcon} alt="node icon" />
                  <h4>Node.js</h4>
                  <p>I mostly use Node for backend development.</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page2">
                <div className="express-card">
                  <img src={expressIcon} alt="express icon" />
                  <h4>Express.js</h4>
                  <p>
                    I love Express Node framework, makes ease and faster for
                    backend development.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page2">
                <div className="mongo-card">
                  <img src={mongoIcon} alt="mongodb icon" />
                  <h4>mongoDB</h4>
                  <p>
                    I am good at using mongoDB atlas to connect with my
                    application.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page3">
                <div className="djongo-card">
                  <img src={djangoIcon} alt="django icon" />
                  <h4>Django</h4>
                  <p>
                    I know basics of django, but am working hard to learn more.
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="technical-skills" id="skills-page3">
                <div className="figma-card">
                  <img src={figmaIcon} alt="figma icon" />
                  <h4>Figma</h4>
                  <p>I am good at working with figma!</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Skills;
