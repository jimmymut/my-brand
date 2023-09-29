import { Link } from "react-router-dom";
import profilePic from "../images/profile.png";
import Menu from "./Menu";

const Header = ({userName}) => {
    return(
        <header className="landing-hed">
            <div className="header-div">
            <div className="owner-sum">
                <img
                className="owner-profile"
                src={profilePic}
                alt="owner profile pic"
                />
                <p>Jimmy's website</p>
            </div>
            <div className="header-status-div">
                <button className="btn header-btn signin-btn">
                <Link to="/signup">Sign Up</Link></button>
                <button className="btn header-btn login-btn">
                <Link to="/login">Log In</Link>
                </button>
                { userName && <div className="prof-pic-name">
                <i className="fa-sharp fa-2x fa-solid fa-circle-user"></i>
                <p className="loggedin-profile-name"></p>
                </div>}
            </div>
            </div>
            <nav>
          <div className="navdiv">
            <input type="checkbox" className="menu-toggler" />
            <div className="humberger"></div>
            <Menu/>
          </div>
          <hr />
        </nav>
      </header>
    );
}

export default Header;