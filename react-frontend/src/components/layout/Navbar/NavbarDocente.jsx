import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import Modal from "../../ui/Modal";
import "./NavbarDocente.css";

const NavbarSection = ({ title, icon, color }) => {
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
      <nav className="navbars-section" style={{ backgroundColor: color }}>
        <div className="navbars-section-title">
          <button className="navs-btn" onClick={handleBack}>
            <span className="material-symbols-outlined icons-section">
              arrow_back
            </span>
          </button>
        </div>
        <div className="navbars-content">
          <div className="navbars-title">
            {icon && <span className="navbar-icon2">{icon}</span>}
            <h2>{title}</h2>
          </div>
          <p> Sistema de Gestión Administrativa y Procesos Académicos </p>
        </div>
        <button
          className="navs-btn logout-btn"
          onClick={() => setIsModalOpen(true)}
        >
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
            variant: "success",
            icon: <FaCheck />,
            onClick: handleLogout,
          },
          {
            text: "Cancelar",
            variant: "danger",
            icon: <FaTimes />,
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />
    </div>
  );
};

export default NavbarSection;
