import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa"; 
import { FaTimes } from "react-icons/fa";
import Modal from "../../ui/Modal";
import "./NavbarSection.css";

const NavbarSection = ({ title, color = "#1976d2" }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
            <span className="material-symbols-outlined icons-section">
              arrow_back
            </span>
          </button>
          
        </div>
        <div className="navbar-content">
          <h2 className="navbar-title">{title}</h2>
          <p>Sistema de Gestión Administrativa y Procesos Académicos</p>
        </div>
        <button className="nav-btn logout-btn" onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined icons-section">
            logout
          </span>
        </button>
      </nav>
       <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message="¿Estás seguro de que deseas cerrar sesión?"
        buttons={[
          {
            text: "Confirmar",
            className: "btn-save",
            icon: <FaCheck />,
            onClick: handleLogout,
          },
          {
            text: "Cancelar",
            className: "btn-delet",
            icon: <FaTimes />,
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />
    </div>
  );
};

export default NavbarSection;
