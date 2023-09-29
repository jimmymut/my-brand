import { Link } from "react-router-dom";
import homeSelect from "../../images/home-select.svg";
import BlogIcon from "../../images/blog.svg";
import msgIcon from "../../images/message.svg";
import logoutIcon from "../../images/logout.svg";
import plusIcon from "../../images/add.svg";

const SideBar = ({displayAddArticleForm, showAllMessages}) => {
    return(
      <div className="leftdiv">
      <Link>
        <div 
        // onclick="return showAllDashboardBlogs();"
        >
          <img src={homeSelect} alt="dashboard pic" />
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to="#dashboard-all-articles">
        <div
        // onclick="return showAllDashboardBlogs();"
        >
          <img src={BlogIcon} alt="blog icon" />
          <p>Blogs</p>
        </div>
      </Link>
      <Link>
        <div
        onClick={showAllMessages}
        >
          <img src={msgIcon} alt="message icon" />
          <p>Messages</p>
        </div>
      </Link>
      <Link
        // onclick="return logoutFunc();"
        id="logout-btn"
        className="logOut-a-tag"
        type="button"
      >
        <div>
          <img src={logoutIcon} alt="logout icon" />
          <p>Log Out</p>
        </div>
      </Link>

      <button
        onClick={displayAddArticleForm}
        id="left-div-btn-display"
        className="left-div-btn"
      >
        <img src={plusIcon} alt="Plus icon" /> New Post
      </button>
    </div>
    );
}

export default SideBar;