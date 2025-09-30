import "./NavbarAdmin.css";
import Modal from "../../ui/Modal"; 
import { FaCheck } from "react-icons/fa"; 
import { FaTimes } from "react-icons/fa"; 
import logo from "../../icons/espiral.svg";
import { useState } from "react";

const NavbarAdmin = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  }

  return (
    <nav className="navbar-admin">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logo" />
        <h3>Gestión</h3> <span className="danger">360</span>
      </div>
      <ul>
        <li className="nav-item">
          <button className="nav-icon-btn" aria-label="Personalizar dashboard">
            <span className="material-symbols-outlined" aria-hidden="true">
              dashboard_customize
            </span>
          </button>
        </li>
        <li>Administrador</li>
        <li className="nav-item">
          <button className="nav-icon-btn" aria-label="Cerrar sesión" onClick={() => setIsModalOpen(true)} >          
            <span className=" icon material-symbols-outlined" aria-hidden="true">
              logout
            </span>
          </button>
        </li>
      </ul>
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
    </nav>
  );
};

export default NavbarAdmin;
