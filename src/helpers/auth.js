export const logoutFunc = (dispatch) => {
  const token = localStorage.getItem("token");
  fetch(`${process.env.REACT_APP_BASE_URL}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: "auth",
          user: null,
      })
        localStorage.removeItem("token");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};