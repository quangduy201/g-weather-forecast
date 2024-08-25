import styles from "./styles.module.scss";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import {useState} from "react";

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
    const [menuStatus, setMenuStatus] = useState("closed");

    const openMenu = () => {
        setMenuStatus("opened");
    };

    const closeMenu = () => {
        setMenuStatus("closed");
    };

    const updateMenu = () => {
        if (menuStatus === "opened") {
            closeMenu();
        } else {
            openMenu();
        }
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/"><img src={logo} alt="logo"/></Link>

            <span>{title}</span>

            <div className={styles.navLinks}>
                <Link to="/">Dashboard</Link>
                <Link to="/history">History</Link>
                <Link to="/subscribe">Subscribe</Link>
            </div>

            <div className={`${styles.burgerMenu} ${styles[menuStatus]}`} onClick={updateMenu}>
                <div className={`${styles.burger} ${styles[menuStatus]}`}></div>
                <div className={`${styles.burger} ${styles[menuStatus]}`}></div>
                <div className={`${styles.burger} ${styles[menuStatus]}`}></div>
            </div>

            <div className={`${styles.menu} ${styles[menuStatus]}`}>
                <div className={`${styles.navLinksMobile} ${styles[menuStatus]}`}>
                    <Link to="/" onClick={closeMenu}>Dashboard</Link>
                    <Link to="/history" onClick={closeMenu}>History</Link>
                    <Link to="/subscribe" onClick={closeMenu}>Subscribe</Link>
                </div>
            </div>

            <div
                className={`${styles.overlay} ${styles[menuStatus]}`}
                onClick={closeMenu}
                onTouchMove={closeMenu}
                onScrollCapture={closeMenu}
            ></div>
        </nav>
    );
};

export default NavBar;