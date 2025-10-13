import "./NavbarModulo.css";
import Modal from "../../ui/Modal";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import logo from "../../icons/espiral.svg";
import { useState, useEffect } from "react";

import facebook from "../../../assets/app-icons/facebook.png";
import github from "../../../assets/app-icons/github.png";
import instagram from "../../../assets/app-icons/instagram.png";
import cromo from "../../../assets/app-icons/cromo.png";
import spotify from "../../../assets/app-icons/spotify.png";
import pinterest from "../../../assets/app-icons/pinterest.png";
import gorgeo from "../../../assets/app-icons/gorjeo.png";
import tiktok from "../../../assets/app-icons/tik-tok.png";
import discord from "../../../assets/app-icons/discord.png";
import avatar from "../../../assets/app-icons/man_3.png";

const NavbarAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  };

  // Cerrar menú de aplicaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-icon-btn") &&
        !event.target.closest(".app-menu-dropdown")
      ) {
        setIsAppMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-user-btn") &&
        !event.target.closest(".user-menu-dropdown")
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar-admin">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logo" />
        <div className="nav-logo-text">
          <h3>Gestión 360</h3>
          <p>Módulo Administrador</p>
        </div>
      </div>
      <ul>
        <li className="nav-item">
          <button className="nav-icon-btn" aria-label="Notificaciones">
            <span className="material-symbols-outlined" aria-hidden="true">
              notifications
            </span>
            <p className="notification-badge">3</p>
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-icon-btn"
            aria-label="Aplicaciones"
            onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              apps
            </span>
          </button>
          {isAppMenuOpen && (
            <div className="app-menu-dropdown">
              <div className="app-menu-grid">
                <div className="app-menu-item">
                  <img src={facebook} alt="Facebook" />
                  <p>Facebook</p>
                </div>
                <div className="app-menu-item">
                  <img src={github} alt="GitHub" />
                  <p>GitHub</p>
                </div>
                <div className="app-menu-item">
                  <img src={instagram} alt="Instagram" />
                  <p>Instagram</p>
                </div>
                <div className="app-menu-item">
                  <img src={cromo} alt="Cromo" />
                  <p>Google</p>
                </div>
                <div className="app-menu-item">
                  <img src={spotify} alt="Spotify" />
                  <p>Spotify</p>
                </div>
                <div className="app-menu-item">
                  <img src={pinterest} alt="Pinterest" />
                  <p>Pinterest</p>
                </div>
                <div className="app-menu-item">
                  <img src={gorgeo} alt="x" />
                  <p>X</p>
                </div>
                <div className="app-menu-item">
                  <img src={tiktok} alt="Tiktok" />
                  <p>Tiktok</p>
                </div>
                <div className="app-menu-item">
                  <img src={discord} alt="Discord" />
                  <p>Discord</p>
                </div>
              </div>
            </div>
          )}
        </li>
        <li className="nav-item no-pulse">
          <button
            className="nav-user-btn"
            aria-label="Menú de usuario"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="user-name">Jhon F. Hidalgo</span>
            <span className="material-symbols-outlined">expand_more</span>
          </button>        
          {isUserMenuOpen && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <img src={avatar} alt="avatar" className="menu-avatar" />
                <div>                 
                  <p className="user-role">Docente Matemáticas</p>
                  <p className="user-email">jhon.hidalgo@gestion360.com</p>
                </div>
              </div>             
              <div className="user-menu-actions-vertical">
                <div className="user-menu-action" onClick={() => alert("Editar perfil")}>
                  <span className="material-symbols-outlined">person</span>
                  <p>Editar perfil</p>
                </div>
                <div className="user-menu-action" onClick={() => alert("Cambiar contraseña")}>
                  <span className="material-symbols-outlined">lock</span>
                  <p>Cambiar contraseña</p>
                </div>
              </div>
            </div>
          )}
        </li>

        <li className="nav-item">
          <button
            className="nav-icon-btn"
            aria-label="Cerrar sesión"
            onClick={() => setIsModalOpen(true)}
          >
            <span
              className=" icon material-symbols-outlined"
              aria-hidden="true"
            >
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