import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Loader from "../components/Loader";
import htmlIcon from "../images/html-icon.png"
import cssIcon from "../images/css-icon.png"
import jsIcon from "../images/javascript-icon.png"
import nodeIcon from "../images/icons8-nodejs-48.png"
import expressIcon from "../images/express-icon.png"
import mongoIcon from "../images/mongodb-icon.png"
import djangoIcon from "../images/django-icon.png"
import figmaIcon from "../images/figma-icon.png";
import { logoutFunc, getUserProfile } from "../helpers/auth";

const Skills = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(()=> {
    getUserProfile(setLoading, setUserProfile, setIsLoggedIn);
  }, [])
  return (
    <div>
      {loading?<Loader className="loader dashboard-loader" message="Loading..." />:
      <div>
        <Header 
        isLoggedIn={isLoggedIn}
        logout={() => logoutFunc(setLoading, setUserProfile, setIsLoggedIn, navigate)}
        userName={userProfile?.name}
        />
        <h1 id="skills-header">Technical Skills</h1>
        <div className="technical-skills" id="skills-page1">
          <div className="html-card">
            <img src={htmlIcon} alt="html icon" />
            <h4>HTML</h4>
            <p>Very good at html structuring.</p>
          </div>
          <div className="css-card">
            <img src={cssIcon} alt="css icon" />
            <h4>CSS</h4>
            <p>
              I am good css styling and keep on learning to keep my css tricks
              on top level.
            </p>
          </div>
          <div className="js-card">
            <img src={jsIcon} alt="JavaScript icon" />
            <h4>JavaScript</h4>
            <p>
              Good in DOM manipulations and JavaScript in general for backend.
            </p>
          </div>
        </div>
        <div className="technical-skills" id="skills-page2">
          <div className="node-card">
            <img src={nodeIcon} alt="node icon" />
            <h4>Node.js</h4>
            <p>I mostly use Node for backend development.</p>
          </div>
          <div className="express-card">
            <img src={expressIcon} alt="express icon" />
            <h4>Express.js</h4>
            <p>
              I love Express Node framework, makes ease and faster for backend
              development.
            </p>
          </div>
          <div className="mongo-card">
            <img src={mongoIcon} alt="mongodb icon" />
            <h4>mongoDB</h4>
            <p>
              I am good at using mongoDB atlas to connect with my application.
            </p>
          </div>
        </div>
        <div className="technical-skills" id="skills-page3">
          <div className="djongo-card">
            <img src={djangoIcon} alt="django icon" />
            <h4>Django</h4>
            <p>I know basics of django, but am working hard to learn more.</p>
          </div>
          <div className="figma-card">
            <img src={figmaIcon} alt="figma icon" />
            <h4>Figma</h4>
            <p>
              I am good at working with figma!
            </p>
          </div>
        </div>
        <div className="main-softskills-div" id="skills-page4">
          <h1 className="skills-header">Soft Skills</h1>
          <div className="display-last-page">
            <div className="soft-skills">
              <ol>
                <li>Communication</li>
                <li>Teamwork</li>
                <li>Technical writing</li>
              </ol>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Skills;
