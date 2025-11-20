import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import "./MenuSemana.css";

const MenuSemana = () => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [semanaDescripcion, setSemanaDescripcion] = useState("Cargando...");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar la descripción de la semana
        const resSemana = await fetch("http://localhost:8000/api/semana");
        const dataSemana = await resSemana.json();
        setSemanaDescripcion(dataSemana.descripcion);

        // Cargar el menú
        const resMenu = await fetch("http://localhost:8000/api/menu");
        const dataMenu = await resMenu.json();
        setMenus(dataMenu);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setSemanaDescripcion("Semana no disponible");
        setMenus({});
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="menu-semana">
        <Navbar />
        <div className="menu-container">
          <p>Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-semana">
      <Navbar />
      <div className="menu-container">
        <div className="left">
          <div className="left__title">
            <h1>Menú Escolar</h1>
            <p id="semana">{semanaDescripcion}</p>
          </div>
        </div>

        <div className="right">
          <div className="right__menu">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
              .filter((dia) => menus[dia])
              .map((dia) => {
                const categorias = menus[dia];
                return (
                  <div key={dia} className="right__card">
                    <div className="card__day">
                      <h1>{dia}</h1>
                      <div className="menu-grid">
                        {(() => {
                          const order = [
                            "Menú",
                            "Complementos",
                            "Menú Alternativo",
                            "Menú Vegetariano",
                          ];
                          return order
                            .filter((tipo) => categorias[tipo])
                            .map((tipo) => {
                              const items = categorias[tipo];

                              // Asignar clase CSS específica para colores
                              let className = "";
                              if (tipo === "Menú") className = "menu";
                              else if (tipo === "Complementos")
                                className = "complementos";
                              else if (tipo === "Menú Alternativo")
                                className = "menu-alternativo";
                              else if (tipo === "Menú Vegetariano")
                                className = "menu-vegetariano";

                              return (
                                <div
                                  key={tipo}
                                  className={`menu-card ${className}`}
                                >
                                  <div className="card__subtitle">
                                    <span className="sub__title">{tipo}</span>
                                  </div>
                                  <div className="menu-items">
                                    {items.map((item, idx) => (
                                      <div key={idx} className="menu-item">
                                        <img
                                          src={`/img/${item.img}`}
                                          alt={item.nombre}
                                        />
                                        <span>{item.nombre}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSemana;
