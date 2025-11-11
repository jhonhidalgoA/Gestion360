import React, { useState } from 'react';
import { X } from 'lucide-react';
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import './EditarMenu.css';


const menuData = {
  "Lunes": {
    "Menú": [
      { nombre: "Arroz", img: "arroz.png" },
      { nombre: "Pollo", img: "pollo.png" }
    ],
    "Menú Vegetariano": [
      { nombre: "Ensalada", img: "ensalada.png" }
    ],
    "Menú Alternativo": [
      { nombre: "Pasta", img: "pasta.png" }
    ],
    "Complementos": [
      { nombre: "Jugo", img: "jugo.png" },
      { nombre: "Frutas", img: "frutas.png" }
    ]
  },
  "Martes": {
    "Menú": [
      { nombre: "Bistec", img: "bistec.png" },
      { nombre: "Platano", img: "platano.png" }
    ],
    "Menú Vegetariano": [
      { nombre: "Vegetales", img: "vegetales.png" }
    ],
    "Menú Alternativo": [
      { nombre: "Pescado", img: "pescado.png" }
    ],
    "Complementos": [
      { nombre: "Pan", img: "pan.png" },
      { nombre: "Yogurt", img: "yogurt.png" }
    ]
  },
  "Miércoles": {
    "Menú": [
      { nombre: "Carne", img: "carne_res.png" },
      { nombre: "Papa", img: "papa.png" }
    ],
    "Menú Vegetariano": [
      { nombre: "Sopa", img: "sopa.png" }
    ],
    "Menú Alternativo": [
      { nombre: "Huevos", img: "huevos.png" }
    ],
    "Complementos": [
      { nombre: "Jugo", img: "jugo.png" },
      { nombre: "Pan", img: "pan.png" }
    ]
  },
  "Jueves": {
    "Menú": [
      { nombre: "Cerdo", img: "cerdo.png" },
      { nombre: "Arroz", img: "arroz.png" }
    ],
    "Menú Vegetariano": [
      { nombre: "Lasaña", img: "lasana.png" }
    ],
    "Menú Alternativo": [
      { nombre: "Pollo Teriyaki", img: "pollo_teriyaki.png" }
    ],
    "Complementos": [
      { nombre: "Frutas", img: "frutas.png" },
      { nombre: "Yogurt", img: "yogurt.png" }
    ]
  },
  "Viernes": {
    "Menú": [
      { nombre: "Pescado", img: "pescado.png" },
      { nombre: "Vegetales", img: "vegetales.png" }
    ],
    "Menú Vegetariano": [
      { nombre: "Tortilla", img: "tortilla.png" }
    ],
    "Menú Alternativo": [
      { nombre: "Salchicha", img: "salchicha.png" }
    ],
    "Complementos": [
      { nombre: "Jugo", img: "jugo.png" },
      { nombre: "Postre", img: "postre.png" }
    ]
  }
};

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
  { value: "lasana.png", label: "Lasaña" },
  { value: "lechuga.png", label: "Lechuga" },
  { value: "pan.png", label: "Pan Artesanal" },
  { value: "pasta.png", label: "Pasta" },
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
  { value: "zanahoria.png", label: "Zanahoria" }
];

const EditarMenu = () => {
  const [menus, setMenus] = useState(menuData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ title: '', message: '', action: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editData, setEditData] = useState({
    nombre: '',
    imagen: '',
    dia: '',
    categoria: '',
    originalNombre: '',
    originalImg: ''
  });

  const semana = "Semana del 4 al 8 de Octubre 2025";

  const normalizeClassName = (text) => {
    return text
      .toLowerCase()
      .replace(/ú/g, 'u')
      .replace(/í/g, 'i')
      .replace(/é/g, 'e')
      .replace(/ó/g, 'o')
      .replace(/á/g, 'a')
      .replace(/ñ/g, 'n')
      .replace(/ /g, '-');
  };

  const handlePlatoClick = (item, dia, categoria) => {
    setEditData({
      nombre: item.nombre,
      imagen: item.img,
      dia: dia,
      categoria: categoria,
      originalNombre: item.nombre,
      originalImg: item.img
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
      // Simular llamada a la API
      const response = await fetch('/api/guardar_cambios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dia: editData.dia,
          categoria: editData.categoria,
          platoOriginal: { nombre: editData.originalNombre, img: editData.originalImg },
          platoNuevo: { nombre: editData.nombre, img: editData.imagen }
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar el estado local
        setMenus(prevMenus => {
          const newMenus = { ...prevMenus };
          const categoryItems = newMenus[editData.dia][editData.categoria];
          const itemIndex = categoryItems.findIndex(
            item => item.nombre === editData.originalNombre && item.img === editData.originalImg
          );
          
          if (itemIndex !== -1) {
            categoryItems[itemIndex] = {
              nombre: editData.nombre,
              img: editData.imagen
            };
          }
          
          return newMenus;
        });

        setShowEditModal(false);
        showModal("Éxito", "Plato actualizado correctamente", () => {
          window.location.reload();
        });
      } else {
        showModal("Error", data.message || "No se pudo actualizar el plato", null);
      }
    } catch (err) {
      console.error("Error:", err);
      showModal("Error", "Hubo un problema al guardar los cambios: " + err.message, null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cerrarModal = () => {
    setShowEditModal(false);
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal') {
      cerrarModal();
    }
  };

  const handleConfirmAction = () => {
    if (confirmData.action) {
      confirmData.action();
    }
    setShowConfirmModal(false);
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showEditModal) {
        cerrarModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showEditModal]);

  return (
    <div className="edit-menu">
      <NavbarSection title="Editar Menú Escolar" color="#7B1FA2" />    
      <div className="menu-container">
        <div className="left">
          <div className="left__title">
            <h1>Menú Escolar</h1>
            <p id="semana">{semana}</p>
          </div>
        </div>

        <div className="right">
          <div className="right__menu">
            {Object.entries(menus).map(([dia, categorias]) => (
              <div key={dia} className="right__card">
                <div className="card__day">
                  <h1>{dia}</h1>
                  <div className="menu-grid">
                    {Object.entries(categorias).map(([tipo, items]) => {
                      const clase = normalizeClassName(tipo);
                      return (
                        <div key={tipo} className={`menu-card ${clase}`}>
                          <div className="card__subtitle">
                            <span className="sub__title">{tipo}</span>
                          </div>
                          <div className="menu-items">
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                className="menu-item"
                                onClick={() => handlePlatoClick(item, dia, tipo)}
                              >
                                <img
                                  src={`/static/img/${item.img}`}
                                  alt={item.nombre}
                                />
                                <span>{item.nombre}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
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
                onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                required
              />

              <label htmlFor="imagen">Imagen del Plato:</label>
              <select
                id="imagen"
                name="imagen"
                value={editData.imagen}
                onChange={(e) => setEditData({ ...editData, imagen: e.target.value })}
                required
              >
                {imageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
                <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarMenu;