export const getUserProfile = (setLoading, setUserProfile, setIsLoggedIn) => {
  const token = localStorage.getItem("token");
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
};

export const logoutFunc = (
  setUserProfile,
  setIsLoggedIn,
) => {
  const token = localStorage.getItem("token");
  fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      setUserProfile(null);
      if (response.status === 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};