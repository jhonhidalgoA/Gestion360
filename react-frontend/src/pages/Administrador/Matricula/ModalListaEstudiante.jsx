import { useState, useEffect } from "react";
import "./ModalListaEstudiante.css";

const ModalListaEstudiantes = ({ isOpen, onClose, onSelect }) => {
  const [matriculas, setMatriculas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:3001/matriculas")
      .then(res => res.json())
      .then(data => setMatriculas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error al cargar estudiantes:", err));
  }, [isOpen]);

  const filteredMatriculas = matriculas.filter(m =>
    m.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.student.documentNumber.includes(searchTerm) ||
    m.student.grade.includes(searchTerm)
  );

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-lista-estudiantes"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "80%",
              maxWidth: "900px",
              maxHeight: "100vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ×
            </button>

            <h3 style={{ marginBottom: "15px", color: "#333" }}>Lista de Estudiantes</h3>

            <input
              type="text"
              placeholder="Buscar por nombre, apellido o grado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <div style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "10px",
            }}>
              {filteredMatriculas.length === 0 ? (
                <p>No se encontraron estudiantes.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>#</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Nombres</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Apellidos</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Grado</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMatriculas.map((m, index) => (
                      <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px" }}>{index + 1}</td>
                        <td style={{ padding: "8px" }}>{m.student.name}</td>
                        <td style={{ padding: "8px" }}>{m.student.lastname}</td>
                        <td style={{ padding: "8px" }}>{m.student.grade}</td>
                        <td style={{ padding: "8px" }}>
                          <button
                            onClick={() => {
                              onSelect(m);
                              onClose();
                            }}
                            style={{
                              background: "#ffc107",
                              color: "#000",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
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

export default ModalListaEstudiantes;