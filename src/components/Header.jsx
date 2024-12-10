import { Link } from "react-router-dom";
import Logo from "./Logo";
import Menu from "./Menu";
import { useContext } from "react";
import { AppContext } from "../App";
import { logoutFunc } from "../helpers/auth";

const Header = ({ isHome = false }) => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <>
    {isHome? (
      <header className="landing-hed">
      <div className="header-div">
        <div className="owner-sum">
          <img
            className="owner-profile"
            src="/profile.png"
            alt="owner profile pic"
          />
          <p>Jimmy's website</p>
        </div>
        <div className="header-status-div">
          {state.user ? (
            <>
            <button className="btn header-btn login-btn" onClick={()=>logoutFunc(dispatch)}>
              Logout
            </button>
            <div className="prof-pic-name">
            {state.user.proPic ? (
              <img className="owner-profile" src={state.user.proPic} alt="" />
            ) : (
              <i className="fa-sharp fa-2x fa-solid fa-circle-user"></i>
            )}
            <p className="loggedin-profile-name">{state.user.firstName}</p>
          </div>
          </>
          ) : (
            <>
            <button className="btn header-btn signin-btn">
              <Link to="/signup">Sign Up</Link>
            </button>
            <button className="btn header-btn login-btn">
              <Link to="/login">Log In</Link>
            </button>
            </>
          )}
        </div>
      </div>
      <h1>JIMMY MUTABAZI</h1>
      <h2 className="landingh2">Full stack web developer</h2>
      <nav>
        <div className="navdiv homenav">
          <input type="checkbox" className="menu-toggler" />
          <div className="humberger"></div>
          <Menu />
        </div>
      </nav>
    </header>
    ): (
      <header className="landing-hed">
      <div className="header-div">
        <Logo />
        <div className="header-status-div">
        {state.user ? (
            <>
            <button className="btn header-btn login-btn" onClick={()=>logoutFunc(dispatch)}>
              Logout
            </button>
            <div className="prof-pic-name">
            {state.user.proPic ? (
              <img className="owner-profile" src={state.user.proPic} alt="" />
            ) : (
              <i className="fa-sharp fa-2x fa-solid fa-circle-user"></i>
            )}
            <p className="loggedin-profile-name">{state.user.firstName}</p>
          </div>
          </>
          ) : (
            <>
            <button className="btn header-btn signin-btn">
              <Link to="/signup">Sign Up</Link>
            </button>
            <button className="btn header-btn login-btn">
              <Link to="/login">Log In</Link>
            </button>
            </>
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
    )}
    </>
  );
};

export default Header;
