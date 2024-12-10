import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Menu = () => {
    const location = useLocation();
    const { pathname } = location;

    return(
        <div className="menu-list">
            <Link to="/" className={pathname === "/"? "active": ""}>Home</Link>
            <Link to="/aboutme" className={pathname === "/aboutme"? "active": ""}>About</Link>
            <Link to="/contactme" className={pathname === "/contactme"? "active": ""}>Contact</Link>
            <Link to="/blogs" className={pathname === "/blogs"? "active": ""}>Blogs</Link>
            <Link to="/skills" className={pathname === "/skills"? "active": ""}>Skills</Link>
            <Link to="/work" className={pathname === "/work"? "active": ""}>Work</Link>
        </div>
    );
}

export default Menu;