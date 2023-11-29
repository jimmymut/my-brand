import { useCallback } from "react";
// import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { LoginSocialTwitter } from 'reactjs-social-login';
import { createButton } from 'react-social-login-buttons';

const config = {
  text: "Connect Twitter",
  icon: "twitter",
  iconFormat: name => `fa fa-${name}`,
  style: { background: "#3b5998" },
  activeStyle: { background: "#293e69" }
};

const TwitterBtn = () => {
  //   const navigate = useNavigate();

  //   const [provider, setProvider] = useState('');
  // const [profile, setProfile] = useState(null);

  const TwitterLoginButton = createButton(config);
    // const googleLogin = useGoogleLogin({
    //     flow: "auth-code",
    //     onSuccess: async ({ code }) => {
    //       setGoogleLoading(true);
    //       fetch(`${process.env.REACT_APP_BASE_URL}/users/auth/google`, {
    //         method: "POST",
    //         body: JSON.stringify({ code }),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       })
    //         .then(async (response) => {
    //           setGoogleLoading(false);
    //           if (response.status === 200) {
    //             const data = await response.json();
    //             localStorage.setItem("token", data.token);
    //             toast.success("Login succeeded!");
    //             return navigate("/");
    //           } else if (response.status === 400) {
    //             toast.error("Bad request!");
    //           } else {
    //             toast.error("Something went wrong, try again");
    //           }
    //         })
    //         .catch((err) => {
    //           setGoogleLoading(false);
    //           console.log(err);
    //           toast.error(err.message);
    //         });
    //     },
    //   });

      const onLoginStart = useCallback(() => {
        toast.success('login start')
      }, [])
    
      // const onLogoutSuccess = useCallback(() => {
      //   setProfile(null)
      //   setProvider('')
      //   toast.success('logout success')
      // }, [])

    return(
        <div className="google-button">
              <LoginSocialTwitter
            isOnlyGetCode={true}
            client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ''}
            redirect_uri={process.env.REACT_APP_TWITTER_REDIRECT_URL || ''}
            onLoginStart={onLoginStart}
            scope="users.read%20tweet.read%20offline.access"
            onResolve={({ provider, data }) => {
              // setProvider(provider)
              // setProfile(data)
              console.log('provider', provider);
              console.log('data', data);
            }}
            onReject={(err) => {
              console.log(err)
            }}
          >
            <TwitterLoginButton />
          </LoginSocialTwitter>
            </div>
    );
}

export default TwitterBtn;