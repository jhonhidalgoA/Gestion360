import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll"; 
import { Link as RouterLink, useLocation } from "react-router-dom"; 
import { MenuData } from "../../../data/NavbarData";
import "./Navbar.css";
import logo from "../../icons/espiral.svg";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [clicked, setClicked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 50 ? setSticky(true) : setSticky(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const isHomePage = location.pathname === "/";

return (
    <nav className={`container ${sticky ? "dark-nav" : ""}`}>
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logo" />
        <RouterLink to="/" onClick={handleClick}>
          Gestión <span className="danger">360</span>
        </RouterLink>
      </div>

      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {MenuData.map((item, index) => (
          <li key={index}>
            {isHomePage ? (
             
              <ScrollLink
                to={item.to}
                smooth={true}
                duration={600}
                offset={-80}
                className={item.cName}
                onClick={handleClick}
              >
                {item.title}
              </ScrollLink>
            ) : (
              // En otras páginas, navega a "/"
              <RouterLink
                to={`/#${item.to}`} 
                className={item.cName}
                onClick={handleClick}
              >
                {item.title}
              </RouterLink>
            )}
          </li>
        ))}
        <li className="btns btn-mobile">
          <RouterLink to="/login" className="btn-ingresar" onClick={handleClick}>
            Ingresar
          </RouterLink>
        </li>
      </ul>

      <div className="menu-icons" onClick={handleClick}>
        {clicked ? (
          <i className="material-symbols-outlined">close</i>
        ) : (
          <i className="material-symbols-outlined">menu_open</i>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
