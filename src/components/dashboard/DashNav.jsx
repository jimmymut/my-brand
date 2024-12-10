const DashNav = () => {
    return(
        <div className="header-div">
          <div className="owner-sum">
            <img
              className="owner-profile"
              src="/profile.png"
              alt="owner profile pic" />
            <p>Jimmy's website</p>
          </div>
          <div className="header-status-div">
            <button className="btn header-btn login-btn">Log out</button>
            <div className="prof-pic-name">
              <p className="loggedin-profile-name"></p>
            </div>
          </div>
        </div>
    );
}

export default DashNav;