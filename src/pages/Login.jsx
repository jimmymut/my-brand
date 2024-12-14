import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "../validations/login";
import Input from "../components/Input";
import { toast } from "react-toastify";
import GoogleBtn from "../components/GoogleBtn";
import OrCont from "../components/OrCont";
import Logo from "../components/Logo";
import FacebookBtn from "../components/FacebookBtn";
import TwitterBtn from "../components/TwitterBtn";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const submitHandler = (data) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200) {
          localStorage.setItem("token", result.token);
          toast.success("You successfully logged in!");
          setLoading(false);
          reset();
          if(result.user.title === "admin") return navigate("/dashboard");
          return navigate("/");
        } else {
          toast.error(result?.message??`Email or password is incorrect!`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error ${err}`);
        setLoading(false);
      });
  };
  return (
    <>
      {googleLoading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <Logo className="fix-left" />
          <p className="login-header">
            Not user? <Link to="/signup">Sign Up</Link> or go{" "}
            <Link to="/">Home</Link>
          </p>
          <div className="login-div">
            <form className="user-forms" onSubmit={handleSubmit(submitHandler)}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                error={errors.email}
                register={register}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                error={errors.password}
                register={register}
              />
              <Link to="#">Forgot password?</Link>
              <button
                className="btn contact-btn"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <Loader className="loader btn-loader" message="Loading..." />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          <OrCont/>
          <GoogleBtn setGoogleLoading={setGoogleLoading} />
          <FacebookBtn/>
          <TwitterBtn/>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
