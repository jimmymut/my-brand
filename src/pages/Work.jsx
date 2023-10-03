import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { logoutFunc, getUserProfile } from "../helpers/auth";

const Work = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(()=> {
    getUserProfile(setLoading, setUserProfile, setIsLoggedIn);
  }, [setLoading, setUserProfile, setIsLoggedIn]);
  return (
    <div>
      {loading?<Loader className="loader dashboard-loader" message="Loading..." />:
      <div>
        <Header
        isLoggedIn={isLoggedIn}
        logout={() => logoutFunc(setUserProfile, setIsLoggedIn)}
        userName={userProfile?.firstName}
        proPic={userProfile?.proPic}
        />
        <h1 className="skills-header">The work I have done so far!</h1>
        <div className="portfolio-ol">
          <div className="list1">
            <div className="work-done">
              <h3>1. Andela Technical Leadership program (ATLP).</h3>
              <br />
              <p>
                This is an intense program that is designed to accelelate full
                stack software development career where they equip with the
                necessary knowlege and skills to excel in this career for nine
                months. At the very beginning I designed and developed this
                website.
              </p>
            </div>
          </div>
          <div className="list1">
            <div className="work-done">
              <h3>2. Laptop4developers program by DevCareerAfrica</h3>
              <br />
              <p>
                This is a three months intense program designed like internship
                that prepare you to a work ready person in softwere development
                and gives access <a className="portfolio-link" href="www.educative.io">educative.io</a> Here I did backend development with Node.js, express and
                mongoDB, Rest API development and documentation on postman and
                how to interact with third party APIs.
              </p>
            </div>
          </div>
          <div className="list1">
            <div className="work-done">
              <h3>3. I4GxZuri-Training program</h3>
              <br />
              <p>
                A three months software development training program that is
                designed for beginners where participants who perform to meet a
                minimum score to be issued a certificate and assigned to a
                project phase to work on a real world project in a team. This
                helps to acquiring collaboration skills. Here I did full stack
                where we learnt basics of html, css and JavaScript for frontend
                part and python with django for backend.
              </p>
            </div>
          </div>
          <div className="list2">
            <div className="work-done">
              <h3>4. Academic internship at Saltel Rwanda</h3>
              <br />
              <p>
                This was a 10 weeks University internship as an Electronics and
                Telecommunications Engineering student where we learnt computer
                maintainence both hardware by disassembling and assembling a
                computer to inspect it's working condition, software by
                formating a pc or resettig it. LAN installation where we learnt
                basics of network and network layers and building a functional
                LAN.
              </p>
            </div>
          </div>
          <div className="list2">
            <div className="work-done">
              <h3>5. School laboratory management</h3>
              <br />
              <p>
                While at my A'level studies, I use to assist in our school
                labolatory which give me a chance be the person in charge
                immediately after my high school studies, where I used to manage
                all school laboratories which incresed my leadership skills and
                management skills.
              </p>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Work;
