import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "../validations/login";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import GoogleBtn from "../components/GoogleBtn";
import OrCont from "../components/OrCont";

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
        if (response.status === 200) {
          const result = await response.json();
          localStorage.setItem("token", result.token);
          fetch(`${process.env.REACT_APP_BASE_URL}/admins/dashboard`, {
            headers: { Authorization: `Bearer ${result.token}` },
          })
            .then((isAdmin) => {
              setLoading(false);
              if (isAdmin.status === 200) {
                toast.success("You successfully logged in!");
                reset();
                navigate("/dashboard");
              } else {
                toast.success("You successfully logged in!");
                reset();
                return navigate("/");
              }
            })
            .catch((error) => {
              console.log(error);
              toast.error(`Error ${error.message}`);
              setLoading(false);
            });
        } else {
          toast.error(`Email or password is incorrect!`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error ${err.message}`);
        setLoading(false);
      });
  };
  return (
    <>
      {googleLoading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <ToastContainer />
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
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
