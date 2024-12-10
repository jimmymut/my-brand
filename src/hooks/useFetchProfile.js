import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AppContext } from "../App";

export const useFetchProfile = () => {
    const { dispatch } = useContext(AppContext);
    const fetchProfile = async () =>{
      const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if(response.status === 200) return data;
      throw new Error(data.message);
    }

    const {
        isPending,
        isFetching,
        data: user,
      } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
      });

      useEffect(() => {
        if(!isFetching && user){
            dispatch({
                type: "auth",
                user,
            })
        }
      }, [isPending, user, isFetching, dispatch]);
}