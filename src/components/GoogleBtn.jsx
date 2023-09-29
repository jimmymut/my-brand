import { useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GoogleBtn = ({setGoogleLoading}) => {
    const navigate = useNavigate();
    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async ({ code }) => {
          setGoogleLoading(true);
          fetch(`${process.env.REACT_APP_BASE_URL}/users/auth/google`, {
            method: "POST",
            body: JSON.stringify({ code }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(async (response) => {
              setGoogleLoading(false);
              if (response.status === 200) {
                const data = await response.json();
                console.log("user data", data);
                localStorage.setItem("token", data.token);
                toast.success("Login succeeded!");
                return navigate("/");
              } else if (response.status === 400) {
                toast.error("Bad request!");
              } else {
                toast.error("Something went wrong, try again");
              }
            })
            .catch((err) => {
              setGoogleLoading(false);
              console.log(err);
              toast.error(err.message);
            });
        },
      });

    return(
        <div className="google-button">
              <GoogleButton
              onClick={googleLogin}
              label='Continue with Google'
              />
            </div>
    );
}

export default GoogleBtn;