import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import DashNav from "../components/dashboard/DashNav";
import SideBar from "../components/dashboard/SideBar";
import MainCompo from "../components/dashboard/MainCompo";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showArticles, setShowArticles] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [formType, setFormType] = useState("add");
  const [articles, setArticles] = useState(null);
  const [messages, setMessages] = useState(null);
  const navigate = useNavigate();

  const displayAddArticleForm = () => {
    setShowArticleForm(true);
    setFormType("add");
    return document.querySelector(".dashtogler").checked = false;
  }
  const showAllMessages = () => {
    setShowArticles(false);
    setShowMessages(true);
  }
  const token = localStorage.getItem("token");  

  useEffect(() => {
    setLoading(true);
    if(!token){
      toast.error("Please login");
      return navigate("/login");
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/admins/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      if (response.status === 200) {
        const blogsArrayFetched = await fetch(
          `${process.env.REACT_APP_BASE_URL}/blogs`
        );
        const blogsArray = await blogsArrayFetched.json();
        const blogs = blogsArray.reverse();
        setArticles(blogs);
        const newsentMessages = await (
          await fetch(`${process.env.REACT_APP_BASE_URL}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ).json();
        const sentMessages = newsentMessages.reverse();
        if (!sentMessages || sentMessages.length === 0) {
          setMessages(null);
        } else {
          setMessages(sentMessages);
        }
      } else {
        return navigate("/login");
      }
      setLoading(false);
    }
    ).catch((err) => {
      toast.error(err.message);
      return navigate("/login");
    });
  }, [token, navigate]);
 
  return (
    <div id="dashbod-body-tag">
      {loading?<Loader className="loader dashboard-loader" message="Loading..." />:
      <>
      <ToastContainer/>
        <DashNav/>
        <div className="dashboard-main">
            <input type="checkbox" className="menu-toggler dashtogler" />
            <div className="humberger dashboard-hamberger"></div>
            <SideBar displayAddArticleForm={displayAddArticleForm} showAllMessages={showAllMessages}/>
            <MainCompo 
            showArticleForm={showArticleForm} 
            formType={formType} 
            setFormType={setFormType} 
            showArticles={showArticles} 
            articles={articles} 
            showMessages={showMessages}
            messages={messages} 
            setMessages={setMessages} 
            setArticles={setArticles} 
            />
        </div>
      </>}
    </div>
  );
};

export default Dashboard;
