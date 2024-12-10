import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AppContext } from "../App";

export const useFetchBlogs = () => {
    const { dispatch } = useContext(AppContext);
    const fetchBlogs = async () =>{
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/blogs`)
        const data = await response.json();
          if(response.status === 200) return data;
          throw new Error(data.error??"Something went wrong");
    }
    const {
        isPending,
        isFetching,
        data: blogs,
      } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
      });

      useEffect(() => {
        dispatch({type: "blogs/loading", payload: isPending});
        if(!isFetching && blogs){
            dispatch({
                type: "blogs",
                payload: blogs,
            })
        }
      }, [isPending, blogs, isFetching, dispatch]);
}