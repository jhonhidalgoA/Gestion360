// src/components/ui/ModalBoletin.jsx
import "./ModalBoletin.css";

const ModalBoletin = ({ isOpen, onClose, boletinData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="header">
          <div className="titulo-principal">COLEGIO STEM 360</div>
          <div className="subtitulo">BOLETÍN DE CALIFICACIONES</div>
          <div className="linea-decorativa"></div>
        </div>
        {boletinData ? (
          <div className="boletin-container">
            <p>
              <strong>Estudiante:</strong> {boletinData.nombre}
            </p>
            <p>
              <strong>Grado:</strong> {boletinData.grado}
            </p>
            <p>
              <strong>Periodo:</strong> {boletinData.periodo}
            </p>

            <table className="boletin-table">
              <thead>
                <tr>
                  <th>Área</th>
                  <th>I.H</th>
                  <th>Nota</th>
                  <th>Estado</th>
                  <th>Fallas</th>
                </tr>
              </thead>
              <tbody>
                {boletinData.asignaturas.length > 0 ? (
                  boletinData.asignaturas.map((asig, index) => (
                    <tr key={index}>
                      <td>{asig.area || "N/A"}</td>
                      <td>{asig.hours_per_week || "0"}</td>
                      <td>
                        {asig.nota_promedio !== undefined
                          ? asig.nota_promedio.toFixed(2)
                          : "—"}
                      </td>
                      <td>{asig.estado || "Pendiente"}</td>
                      <td>{asig.fallas || "0"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", color: "#7f8c8d" }}
                    >
                      No hay asignaturas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="fecha-generacion">
              Documento generado el {new Date().toLocaleDateString("es-ES")} a
              las{" "}
              {new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ) : (
          <p>Cargando...</p>
        )}

        <div className="modal-actions">
          <button onClick={() => window.print()} className="modal-btn">
            <span className="material-symbols-outlined">print</span> Imprimir
          </button>
          <button
            onClick={() => alert("PDF no implementado aún")}
            className="modal-btn"
          >
            <span className="material-symbols-outlined">download</span> PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalBoletin;
