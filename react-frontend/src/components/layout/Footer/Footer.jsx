import React, { useState, useEffect } from "react";
import "./Footer.css";
import { Clock } from "lucide-react";
import logo from "../../icons/espiral.svg";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      const open = day >= 1 && day <= 5 && hour >= 7 && hour < 17;      
      setIsOpen(open);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-column">
        <div className="footer-logo">
          <img src={logo} alt="logo" className="logo" />
          <h4>Gestión 360</h4>
        </div>
        <p>
          Transformando vidas a través de la educación con innovación y
          excelencia académica.
        </p>
        <div className="status-indicator">
          <Clock className="clock-icon" />
          <div className="status-text">
            <div className="status-line">
              <span
                className={`status-dot ${isOpen ? "open" : "closed"}`}
              ></span>
              <span className="status-label">
                {isOpen ? "Estamos disponibles" : "Cerrado ahora"}
              </span>
            </div>
            <p className="schedule">Lunes - Viernes: 7:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
      <div className="footer-column">
        <h4 className="footer-subtitle">Institucional</h4>
        <ul>
          <li>
            <a href="">Quiénes Somos</a>
          </li>
          <li>
            <a href="">Modelo Educativo</a>
          </li>
          <li>
            <a href="">Admisiones 2026</a>
          </li>
          <li>
            <a href="">Calendario Académico</a>
          </li>
        </ul>
      </div>
      <div className="footer-column">
        <h4 className="footer-subtitle">Recursos</h4>
        <ul>
          <li>
            <a href="">Biblioteca Virtual</a>
          </li>
          <li>
            <a href="">Blog Educativo</a>
          </li>
          <li>
            <a href="">Preguntas Frecuentes</a>
          </li>
          <li>
            <a href="">Preguntas Frecuentes</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
