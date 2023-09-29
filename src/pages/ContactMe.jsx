import { useState, useEffect } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import Input, { TextArea } from "../components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import messageSchema from "../validations/message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logoutFunc, getUserProfile } from "../helpers/auth";


const ContactMe = () => {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(messageSchema),
  });
  const submitHandler = (data) => {
    setLoading(true);
    console.log(data);
    fetch(`${process.env.REACT_APP_BASE_URL}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        toast.success(`The message is successfully sent!`);
        reset();
      } else {
        toast.error(`Error! Message not sent, Try again!`);
      }
    }).catch((error) => {
      toast.error(`Error occured ${error.message}`);
      return setLoading(false);
    })
  };

  useEffect(()=> {
    getUserProfile(setLoading, setUserProfile, setIsLoggedIn);
  }, [])

  return (
    <div>
      <ToastContainer />
      <Header 
      isLoggedIn={isLoggedIn}
      logout={() => logoutFunc(setLoading, setUserProfile, setIsLoggedIn, navigate)}
      userName={userProfile?.name}
      />
      <div className="contacdiv">
        <div className="socialDiv">
          <h3>Contact me on</h3>
          <Link to="#" disabled>
            <i className="fa-sharp fa-solid fa-phone"></i>
            +250789706729
          </Link>
          <Link to="#" disabled>
            <i className="fa-solid fa-envelope"></i>
            mutabazijimmy9@gmail.com
          </Link>
          <div>
            <a href="https://twitter.com/MutabaziJimmy1" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/mutabazi-jimmy-134528116/"
              target="_blank" rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://github.com/jimmymut" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
          </div>
          <p>For more information, reach me via the Contact Me form.</p>
        </div>
        <div id="sendMessageForm" className="send-message-class">
          <form id="sendMessage" onSubmit={handleSubmit(submitHandler)}>
            <h2>Contact Me</h2>
            <Input
            type="text"
            name="contName"
            placeholder="Full Name"
            error={errors.contName}
            register={register}
            />
            <Input
            type="email"
            name="contEmail"
            placeholder="Email"
            error={errors.contEmail}
            register={register}
            />
            <Input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            error={errors.phone}
            register={register}
            />
            <TextArea
            name="message"
            placeholder="Message"
            error={errors.message}
            register={register}
            />
            <button
              className="btn contact-btn"
              type="submit"
              disabled={loading? true: false}
            >
              {loading?<Loader className="loader btn-loader" message="Loading..."/>:
              "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
