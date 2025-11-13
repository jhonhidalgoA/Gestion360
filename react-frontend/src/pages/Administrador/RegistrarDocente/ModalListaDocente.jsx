import { useState, useEffect } from "react";
import "./ModalListaDocente.css";

const ModalListaDocente = ({ isOpen, onClose, onSelect }) => {
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch("http://localhost:8000/api/docentes")
      .then((res) => res.json())
      .then((data) => {
        setDocentes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar docentes:", err);
        setDocentes([]); // Asegurar que no se quede en estado vacío si falla
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const filteredDocentes = docentes.filter((docente) => {
    const name = (docente.teacherName || "").toLowerCase();
    const lastname = (docente.teacherLastname || "").toLowerCase();
    const documentNumber = docente.teacherDocumentNumber || "";
    const area = (docente.teacherArea || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      name.includes(term) ||
      lastname.includes(term) ||
      documentNumber.includes(searchTerm) ||
      area.includes(term)
    );
  });

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div
            className="modal-lista-docentes"
            onClick={(e) => e.stopPropagation()}
          >
            <buttons onClick={onClose} className="close-button">
              ×
            </buttons>

            <h3>Lista de Docentes</h3>

            <input
              type="text"
              placeholder="Buscar por nombre, apellido o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="table-container">
              {loading ? (
                <p>Cargando...</p>
              ) : filteredDocentes.length === 0 ? (
                <p>No se encontraron docentes.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Área</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocentes.map((docente, index) => (
                      <tr key={docente.id}>
                        <td>{index + 1}</td>
                        <td>{docente.teacherName}</td>
                        <td>{docente.teacherLastname}</td>
                        <td>{docente.teacherArea || "–"}</td>
                        <td>
                          <button
                            onClick={() => {
                              onSelect(docente);
                              onClose();
                            }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalListaDocente;