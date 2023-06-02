import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"
import AboutMe from "./pages/AboutMe";
import ContactMe from "./pages/ContactMe";
import Blogs from "./pages/Blogs";
import Skills from "./pages/Skills";
import Work from "./pages/Work";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import BlogDetails from "./pages/BlogDetails";
import SignUp from "./pages/Signup";

const AppRoutes = () => {
    return(
        <Routes>
            <Route exact path="" element={<Home/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/signup" element={<SignUp/>}/>
            <Route exact path="/aboutme" element={<AboutMe/>}/>
            <Route exact path="/contactme" element={<ContactMe/>}/>
            <Route exact path="/blogs" element={<Blogs/>}/>
            <Route exact path="/blogs/:blogId" element={<BlogDetails/>}/>
            <Route exact path="/skills" element={<Skills/>}/>
            <Route exact path="/work" element={<Work/>}/>
            <Route exact path="/dashboard" element={<Dashboard/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default AppRoutes;