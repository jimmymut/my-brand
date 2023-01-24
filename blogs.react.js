class StatusHead extends React.Component {
  render() {
    return (
      <div>
        <div className="header-div">
          <div className="owner-sum">
            <img
              className="owner-profile"
              src="./Images/profile.png"
              alt="owner profile picture"
            />
            <p>Jimmy's website</p>
          </div>
          <div className="header-status-div">
            <button className="btn header-btn signin-btn">
              <a href="./userSignUp.html">Sign Up</a>
            </button>
            <button className="btn header-btn login-btn">
              <a href="./login.html">Log In</a>
            </button>
            <div className="prof-pic-name">
              <i className="fa-sharp fa-2x fa-solid fa-circle-user"></i>
              <p className="loggedin-profile-name"></p>
            </div>
          </div>
        </div>
        <nav>
          <div className="navdiv">
            <input type="checkbox" className="menu-toggler" />
            <div className="humberger"></div>
            <div className="menu-list">
              <a href="./index.html">Home</a>
              <a href="./aboutme.html">AboutMe</a>
              <a href="./contactme.html">ContactMe</a>
              <a href="./blogs.html">Blogs</a>
              <a href="./skills.html">Skills</a>
              <a href="./portfolio.html">Portfolio</a>
            </div>
          </div>
          <hr />
        </nav>
      </div>
    );
  }
}
const headerRoot = ReactDOM.createRoot(
  document.querySelector("#blog-header-rect")
);
headerRoot.render(<StatusHead />);

class Heading extends React.Component {
  render() {
    return <b>Blogs</b>;
  }
}

const headingRoot = ReactDOM.createRoot(
  document.querySelector("#blogs-summary-h1")
);
headingRoot.render(<Heading />);

class BlogSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:5000/blogs");
      const blogs = await response.json();
      this.setState({
        data: blogs,
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <div>
        <div id="blog-summary-1" className="mainblog-summry">
          {this.state.data.map((article) => {
            return (
              <div className="blog-summary-div">
                <img src={article.file.url} alt="Article image" />
                <div className="artcle blog-summury-lc">
                  <div className="like-coment">
                    <img
                      className="bloglikeImage"
                      onclick="return likesfunction();"
                      src="./Images/Vector.svg"
                      alt="likes icon"
                    />
                    <p className="number-oflikes">{article.likes.length}</p>
                  </div>
                  <div className="like-coment">
                    <img src="./Images/Vector (1).svg" alt="comments icon" />
                    <p className="number-of-comments">
                      {article.comments.length}
                    </p>
                  </div>
                </div>
                <div className="blog-sum-title">
                  <h4>{article.title}</h4>
                  <p>Created {new Date(article.createdAt).toLocaleString()}</p>
                </div>
                <p className="article-summury">
                  {article.description.substr(0, 100)}...
                </p>
                <a href={"./blogOne.html?:" + article._id} target="_blank">
                  Read More
                </a>
              </div>
            );
          })}
        </div>
        <div className=""></div>
      </div>
    );
  }
}

const artclSum = ReactDOM.createRoot(
  document.querySelector("#blog-summ-wit-swipper")
);
artclSum.render(<BlogSummary />);
