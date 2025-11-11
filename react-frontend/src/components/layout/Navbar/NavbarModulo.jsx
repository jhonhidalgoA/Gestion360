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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("role");
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

  // Cerrar dropdown de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-icon-btn") &&
        !event.target.closest(".notification-dropdown")
      ) {
        setIsNotificationModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=1",
      name: "Terry Franci",
      message: "requests permission to change Project - Nganter App",
      time: "5 min ago",
      status: "online",
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/40?img=2",
      name: "Terry Franci",
      message: "requests permission to change Project - Nganter App",
      time: "5 min ago",
      status: "offline",
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/40?img=3",
      name: "Terry Franci",
      message: "requests permission to change Project - Nganter App",
      time: "5 min ago",
      status: "online",
    },
    {
      id: 4,
      avatar: "https://i.pravatar.cc/40?img=4",
      name: "Terry Franci",
      message: "requests permission to change Project - Nganter App",
      time: "5 min ago",
      status: "online",
    },
  ];

  return (
    <nav className="navbar-admin">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logo" />
        <div className="nav-logo-text">
          <h3>Gestión 360</h3>
          <p>
            Módulo{" "}
            {(() => {
              const role = localStorage.getItem("role");
              if (role === "administrador") return "Administrador";
              if (role === "docente") return "Docente";
              if (role === "estudiante") return "Estudiante";
              if (role === "padre") return "Padre de Familia";
              return "Desconocido";
            })()}
          </p>
        </div>
      </div>
      <ul>
        <li className="nav-item notification-container">
          <button
            className="nav-icon-btn"
            aria-label="Notificaciones"
            onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              notifications
            </span>
            <p className="notification-badge">3</p>
          </button>
          {/* Dropdown de Notificaciones */}
          {isNotificationModalOpen && (
            <div className="notification-dropdown modal-alert">
              <div className="notification-header">
                <h4>Mensajes</h4>
                <button
                  className="close-btn"
                  onClick={() => setIsNotificationModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className="notification-item">
                    <div className="notification-avatar">
                      <img src={notif.avatar} alt="avatar" />
                      <span className={`status-dot ${notif.status}`}></span>
                    </div>
                    <div className="notification-content">
                      <p>
                        <strong>{notif.name}</strong> {notif.message}
                      </p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="view-all-button">
                <button onClick={() => alert("Ver todas las notificaciones")}>
                  View All Notification
                </button>
              </div>
            </div>
          )}
        </li>

        <li className="nav-item notification-container ">
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
            <span className="user-name">
              {localStorage.getItem("full_name") || "Usuario"}
            </span>
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
                <div
                  className="user-menu-action"
                  onClick={() => alert("Editar perfil")}
                >
                  <span className="material-symbols-outlined">person</span>
                  <p>Editar perfil</p>
                </div>
                <div
                  className="user-menu-action"
                  onClick={() => alert("Cambiar contraseña")}
                >
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
            <span className="icon material-symbols-outlined" aria-hidden="true">
              logout
            </span>
          </button>
        </li>
      </ul>

      {/* Modal de cierre de sesión */}
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
