import { Link } from "react-router-dom";
import Logo from "./Logo";
import Menu from "./Menu";

const Header = ({ isLoggedIn, logout, userName, proPic }) => {
  return (
    <header className="landing-hed">
      <div className="header-div">
        <Logo />
        <div className="header-status-div">
          {!isLoggedIn && (
            <button className="btn header-btn signin-btn">
              <Link to="/signup">Sign Up</Link>
            </button>
          )}
          {isLoggedIn ? (
            <button className="btn header-btn login-btn" onClick={logout}>
              Log Out
            </button>
          ) : (
            <button className="btn header-btn login-btn">
              <Link to="/login">Log In</Link>
            </button>
          )}
          {isLoggedIn && userName && (
            <div className="prof-pic-name">
              {proPic ? (
                <img className="owner-profile" src={proPic} alt="" />
              ) : (
                <i className="fa-sharp fa-2x fa-solid fa-circle-user"></i>
              )}
              <p className="loggedin-profile-name">{userName}</p>
            </div>
          )}
        </div>
      </div>
      <nav>
        <div className="navdiv">
          <input type="checkbox" className="menu-toggler" />
          <div className="humberger"></div>
          <Menu />
        </div>
        <hr />
      </nav>
    </header>
  );
};

export default Header;
