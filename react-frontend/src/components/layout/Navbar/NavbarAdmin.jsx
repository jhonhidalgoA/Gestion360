import "./NavbarAdmin.css";
import logo from "../../icons/espiral.svg";

const NavbarAdmin = () => {
  return (
    <nav className="navbar-admin">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logo" />
        <h3>Gestión</h3> <span className="danger">360</span>
      </div>
      <ul>
        <li class="nav-item">
          <button class="nav-icon-btn" aria-label="Personalizar dashboard">
            <span class="material-symbols-outlined" aria-hidden="true">
              dashboard_customize
            </span>
          </button>
        </li>
        <li>Administrador</li>
        <li class="nav-item">
          <button className="nav-icon-btn" aria-label="Cerrar sesión">          
            <span class=" icon material-symbols-outlined" aria-hidden="true">
              logout
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin;
