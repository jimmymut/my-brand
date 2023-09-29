const token = localStorage.getItem("token");

export const getUserProfile = (setLoading, setUserProfile, setIsLoggedIn) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          setLoading(false);
          if (response.status === 200) {
            const loggedInUser = await response.json();
            setUserProfile(loggedInUser);
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setIsLoggedIn(false);
        });
}

export const logoutFunc = (setLoading, setUserProfile, setIsLoggedIn, navigate) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setLoading(false);
        setUserProfile(null);
        if (response.status === 200) {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
};