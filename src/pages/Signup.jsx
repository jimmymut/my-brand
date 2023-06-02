import { useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../components/Input";
import signUpSchema from "../validations/signUp";
import { ToastContainer, toast } from "react-toastify";
import GoogleBtn from "../components/GoogleBtn";
import OrCont from "../components/OrCont";


const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const submitHandler = (data) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.status === 200) {
          console.log("signup response", await response.json());
          toast.success("Account created successfully, proceed to login!");
          reset();
        } else if (response.status === 400) {
          toast.error("Bad request!");
        } else {
          toast.error("Something went wrong, try again");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <>
      {googleLoading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <ToastContainer />
          <Header />
          <p className="login-header">
            Already a user? <Link to="/login">Login</Link> or go{" "}
            <Link to="/">Home</Link>
          </p>
          <div className="login-div sign-up-form-div">
            <form className="user-forms" onSubmit={handleSubmit(submitHandler)}>
              <Input
                name="firstName"
                placeholder="First Name"
                error={errors.firstName}
                register={register}
                labelClassName="input-label"
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                error={errors.lastName}
                register={register}
                labelClassName="input-label"
              />
              <Input
                name="email"
                placeholder="Email"
                error={errors.email}
                register={register}
                labelClassName="input-label"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                error={errors.password}
                register={register}
                labelClassName="input-label"
              />
              <Input
                type="password"
                name="comfirmPassword"
                placeholder="Confirm Password"
                error={errors.comfirmPassword}
                register={register}
                labelClassName="input-label"
              />
              <button
                className="btn contact-btn"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <Loader className="loader btn-loader" message="Loading..." />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
            <OrCont/>
            <GoogleBtn setGoogleLoading={setGoogleLoading} />
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
