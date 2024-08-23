import styles from "./styles.module.scss";
import {Link, useLocation} from "react-router-dom";
import logo from "../../assets/logo.svg";

const getTitle = (path) => {
    switch (path) {
        case "/history":
            return "History";
        case "/subscribe":
            return "Subscribe";
        default:
            return "Weather Dashboard";
    }
}

const NavBar = () => {
    const location = useLocation();
    const title = getTitle(location.pathname);

    return (
        <nav className={styles.navbar}>
            <Link to="/"><img src={logo} alt="logo" width="60px"/></Link>

            <span>{title}</span>

            <div className={styles.navLinks}>
                <Link to="/">Dashboard</Link>
                <Link to="/history">History</Link>
                <Link to="/subscribe">Subscribe</Link>
            </div>
        </nav>
    );
};

export default NavBar;