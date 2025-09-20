import { useNavigate } from "react-router-dom";
import "./NavbarSection.css";

const NavbarSection = ({ title, color = "#1976d2" }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar-section" style={{ backgroundColor: color }}>
        <div className="navbar-section-title">
          <button className="nav-btn" onClick={handleBack}>
            <span className="material-symbols-outlined icons-section">arrow_back</span>
          </button>
          <h2 className="navbar-title">{title}</h2>
        </div>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
        <span className="material-symbols-outlined icons-section">logout</span>
      </button>
      </nav>      
    </div>
  );
};

export default NavbarSection;
