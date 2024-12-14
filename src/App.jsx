import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useReducer } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppContext = createContext(null);

// A reducer function to be used with useReducer
const reducer = (state, action) => {
  switch (action.type) {
    case "auth":
      return {
        ...state,
        user: action.user,
      };
    case "blogs":
      return {
        ...state,
        blogs: action.payload,
      };
    case "blogs/add":
      return {
        ...state,
        blogs: [action.payload, ...state.blogs],
      };
    case "blogs/update":
      const updB = action.payload;
      const updatedBlogs = state.blogs.map((blog) => {
        if (blog._id === updB._id) return updB;
        return blog;
      });
      return {
        ...state,
        blogs: updatedBlogs,
      };
    case "blogs/like":
      const like = action.payload.like;
      const blg = state.blogs.find((blog) => blog._id !== like.blogId);
      if (blg) {
        let likes = [];
        if (action.payload.type === "unlike") {
          likes = blg.likes.filter((lk) => lk._id === like._id);
        } else {
          likes = blg.likes.push(like);
        }
        const newBlg = {
          ...blg,
          likes,
        };
        const updatedBlogs = state.blogs.map((bl) => {
          if (bl._id === newBlg._id) return newBlg;
          return bl;
        });
        return {
          ...state,
          blogs: updatedBlogs,
        };
      }
      return state;
    case "blogs/comment":
      const comment = action.payload;
      const blog = state.blogs.find((blog) => blog._id !== comment.blogId);
      if (blog) {
        const newBlg = {
          ...blog,
          comments: [comment, blog.comments],
        };
        const updatedBlogs = state.blogs.map((bl) => {
          if (bl._id === newBlg._id) return newBlg;
          return bl;
        });
        return {
          ...state,
          blogs: updatedBlogs,
        };
      }
      return state;
    case "blogs/delete":
      const id = action.payload;
      const remainingBlogs = state.blogs.filter((blog) => blog._id !== id);
      return {
        ...state,
        blogs: remainingBlogs,
      };
    case "blogs/loading":
      return {
        ...state,
        blogsLoading: action.payload,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    blogsLoading: false,
    worksLoading: false,
    skillsLoading: false,
    blogs: [],
  });
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch }}>
        <AppRoutes />
      </AppContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
