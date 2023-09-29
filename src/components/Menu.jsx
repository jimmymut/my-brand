import { Link } from "react-router-dom";

const Menu = () => {
    return(
        <div className="menu-list">
            <Link to="/">Home</Link>
            <Link to="/aboutme">AboutMe</Link>
            <Link to="/contactme">ContactMe</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/work">Work</Link>
        </div>
    );
}

export default Menu;