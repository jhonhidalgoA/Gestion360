import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import "./EditarMenu.css";

const imageOptions = [
  { value: "", label: "-- Selecciona una imagen --" },
  { value: "arroz.png", label: "Arroz" },
  { value: "aguacate.png", label: "Aguacate" },
  { value: "berenjena.png", label: "Berenjena" },
  { value: "bistec.png", label: "Bistec" },
  { value: "carne_res.png", label: "Carne" },
  { value: "cerdo.png", label: "Cerdo" },
  { value: "coliflor.png", label: "Coliflor" },
  { value: "ensalada.png", label: "Ensalada" },
  { value: "filete.png", label: "Filete" },
  { value: "pollo.png", label: "Pollo" },
  { value: "frutas.png", label: "Frutas" },
  { value: "huevos.png", label: "Huevos" },
  { value: "jugo.png", label: "Jugos" },
  { value: "lasagna.png", label: "Lasaña" },
  { value: "lechuga.png", label: "Lechuga" },
  { value: "pan.png", label: "Pan Artesanal" },
  { value: "pasta.png", label: "Pasta" },
  { value: "papas.png", label: "Papa" },
  { value: "pollo.png", label: "Pollo" },
  { value: "pescado.png", label: "Pescado" },
  { value: "platano.png", label: "Platano" },
  { value: "pollo_teriyaki.png", label: "Pollo Teriyaki" },
  { value: "postre.png", label: "Postre" },
  { value: "repollo.png", label: "Repollo" },
  { value: "salchicha.png", label: "Salchicha" },
  { value: "salmon_1.png", label: "Salmon" },
  { value: "sopa.png", label: "Sopa" },
  { value: "tortilla.png", label: "Tortilla" },
  { value: "vegetales.png", label: "Vegetales" },
  { value: "vegetales_2.png", label: "Vegetales 2" },
  { value: "yogurt.png", label: "Yogurt" },
  { value: "zanahoria.png", label: "Zanahoria" },
];

const EditarMenu = () => {
  const [menus, setMenus] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({
    title: "",
    message: "",
    action: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editData, setEditData] = useState({
    nombre: "",
    imagen: "",
    dia: "",
    categoria: "",
    originalNombre: "",
    originalImg: "",
  });

  const [semanaDescripcion, setSemanaDescripcion] = useState("Cargando...");
  const [editingSemana, setEditingSemana] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");

  const normalizeClassName = (text) => {
    return text
      .toLowerCase()
      .replace(/ú/g, "u")
      .replace(/í/g, "i")
      .replace(/é/g, "e")
      .replace(/ó/g, "o")
      .replace(/á/g, "a")
      .replace(/ñ/g, "n")
      .replace(/ /g, "-");
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/menu");
        if (!response.ok) throw new Error("Error al cargar el menú");
        const data = await response.json();
        setMenus(data);
      } catch (err) {
        console.error("Error al cargar menú:", err);
        setMenus({}); // Fallback seguro
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const cargarSemana = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/semana");
        const data = await res.json();
        setSemanaDescripcion(data.descripcion);
        setNuevaDescripcion(data.descripcion);
      } catch (err) {
        console.error("Error al cargar la semana:", err);
        setSemanaDescripcion("Semana no disponible");
      }
    };

    cargarSemana();
  }, []);

  const handlePlatoClick = (item, dia, categoria) => {
    setEditData({
      nombre: item.nombre,
      imagen: item.img,
      dia: dia,
      categoria: categoria,
      originalNombre: item.nombre,
      originalImg: item.img,
    });
    setShowEditModal(true);
  };

  const showModal = (title, message, action) => {
    setConfirmData({ title, message, action });
    setShowConfirmModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData.nombre.trim() || !editData.imagen.trim()) {
      showModal("Advertencia", "Por favor completa todos los campos", null);
      return;
    }

    if (editData.imagen === "") {
      showModal("Advertencia", "Por favor selecciona una imagen válida", null);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/guardar_cambios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dia: editData.dia,
            categoria: editData.categoria,
            platoOriginal: {
              nombre: editData.originalNombre,
              img: editData.originalImg,
            },
            platoNuevo: { nombre: editData.nombre, img: editData.imagen },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar estado local
        setMenus((prevMenus) => {
          const newMenus = { ...prevMenus };
          const categoryItems = newMenus[editData.dia][editData.categoria];
          const itemIndex = categoryItems.findIndex(
            (item) =>
              item.nombre === editData.originalNombre &&
              item.img === editData.originalImg
          );

          if (itemIndex !== -1) {
            categoryItems[itemIndex] = {
              nombre: editData.nombre,
              img: editData.imagen,
            };
          }

          return newMenus;
        });

        setShowEditModal(false);
        showModal("Éxito", "Plato actualizado correctamente", () => {});
      } else {
        showModal(
          "Error",
          data.message || "No se pudo actualizar el plato",
          null
        );
      }
    } catch (err) {
      console.error("Error:", err);
      showModal(
        "Error",
        "Hubo un problema al guardar los cambios: " + err.message,
        null
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cerrarModal = () => {
    setShowEditModal(false);
  };

  const handleModalClick = (e) => {
    if (e.target.className === "modal") {
      cerrarModal();
    }
  };

  const handleConfirmAction = () => {
    if (confirmData.action) {
      confirmData.action();
    }
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showEditModal) {
        cerrarModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showEditModal]);

  // Mostrar carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="edit-menu">
        <NavbarSection title="Editar Menú Escolar" color="#7B1FA2" />
        <div className="menu-container">
          <div className="left">
            <div className="left__title">
              <h1>Menú Escolar</h1>
              <p
                id="semana"
                onClick={() => setEditingSemana(true)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {semanaDescripcion}
              </p>
            </div>
          </div>
          <div className="right">
            <div className="right__menu">
              <p>Cargando menú...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay menú cargado, mostrar mensaje
  if (Object.keys(menus).length === 0) {
    return (
      <div className="edit-menu">
        <NavbarSection title="Editar Menú Escolar" color="#7B1FA2" />
        <div className="menu-container">
          <div className="left">
            <div className="left__title">
              <h1>Menú Escolar</h1>
              <p
                id="semana"
                onClick={() => setEditingSemana(true)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {semanaDescripcion}
              </p>
            </div>
          </div>
          <div className="right">
            <div className="right__menu">
              <p>No se encontró menú para esta semana.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-menu">
      <NavbarSection title="Editar Menú Escolar" color="#7B1FA2" />
      <div className="menu-container">
        <div className="left">
          <div className="left__title">
            <h1>Menú Escolar</h1>
            <p
              id="semana"
              onClick={() => setEditingSemana(true)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {semanaDescripcion}
            </p>
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
                            .filter((tipo) => categorias[tipo]) // Solo los que existen
                            .map((tipo) => {
                              const items = categorias[tipo];
                              const clase = normalizeClassName(tipo);
                              return (
                                <div
                                  key={tipo}
                                  className={`menu-card ${clase}`}
                                >
                                  <div className="card__subtitle">
                                    <span className="sub__title">{tipo}</span>
                                  </div>
                                  <div className="menu-items">
                                    {items.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="menu-item"
                                        onClick={() =>
                                          handlePlatoClick(item, dia, tipo)
                                        }
                                      >
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

      {showEditModal && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <button className="close" onClick={cerrarModal}>
              <X size={28} />
            </button>
            <h2>Editar Plato</h2>
            <form id="editarForm" onSubmit={handleSubmit}>
              <label htmlFor="nombre">Nombre del Plato:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={editData.nombre}
                onChange={(e) =>
                  setEditData({ ...editData, nombre: e.target.value })
                }
                required
              />

              <label htmlFor="imagen">Imagen del Plato:</label>
              <select
                id="imagen"
                name="imagen"
                value={editData.imagen}
                onChange={(e) =>
                  setEditData({ ...editData, imagen: e.target.value })
                }
                required
              >
                {imageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal">
          <div className="confirm-modal-content">
            <h2>{confirmData.title}</h2>
            <p>{confirmData.message}</p>
            <div className="confirm-modal-buttons">
              <button className="btn-confirm" onClick={handleConfirmAction}>
                Aceptar
              </button>
              {confirmData.action && (
                <button
                  className="btn-cancel"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {editingSemana && (
        <div className="modal" onClick={() => setEditingSemana(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close">
              <X size={24} />
            </button>
            <h2>Editar semana</h2>
            <form
              id="editarSemanaForm"
              onSubmit={(e) => {
                e.preventDefault();
                fetch("http://localhost:8000/api/semana", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ descripcion: nuevaDescripcion }),
                })
                  .then((res) => (res.ok ? res.json() : Promise.reject()))
                  .then(() => {
                    setSemanaDescripcion(nuevaDescripcion);
                    setEditingSemana(false);
                  })
                  .catch((err) => {
                    console.error("Error al guardar:", err);
                    alert("Error al guardar la semana");
                  });
              }}
            >
              <label htmlFor="semana-input">Descripción:</label>
              <input
                id="semana-input"
                type="text"
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
              />
              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarMenu;
