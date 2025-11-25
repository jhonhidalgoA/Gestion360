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
              <strong>Documento:</strong> {boletinData.documento}
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
                  <th>Asignatura</th>
                  <th>I.H</th>
                  <th>Nota</th>
                  <th>Estado</th>
                  <th>Fallas</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Agrupar asignaturas por área
                  const grupos = {};
                  boletinData.asignaturas.forEach((asig) => {
                    if (!grupos[asig.area]) {
                      grupos[asig.area] = [];
                    }
                    grupos[asig.area].push(asig);
                  });

                  // Crear filas
                  const filas = [];

                  // Iterar sobre las áreas
                  Object.keys(grupos).forEach((area) => {
                    // Fila de encabezado de área (solo una vez por área)
                    filas.push(
                      <tr key={`area-${area}`} className="area-header">
                        <td
                          colSpan="6"
                          style={{
                            backgroundColor: "#d0e7ff",
                            fontWeight: "bold",
                            textAlign: "left",
                            padding: "8px",
                          }}
                        >
                          {area.toUpperCase()}
                        </td>
                      </tr>
                    );

                    // Filas de asignaturas dentro de esta área
                    grupos[area].forEach((asig, index) => {
                      filas.push(
                        <tr key={`asig-${asig.nombre_asignatura}-${index}`}>
                          <td>
                            <strong>{asig.nombre_asignatura || "N/A"}</strong>
                          </td>

                          <td>{asig.hours_per_week || "0"}</td>
                          <td>
                            {typeof asig.nota_promedio === "number"
                              ? asig.nota_promedio.toFixed(2)
                              : "—"}
                          </td>
                          <td>{asig.estado || "Pendiente"}</td>
                          <td>{asig.fallas || "0"}</td>
                        </tr>
                      );
                    });
                  });

                  return filas;
                })()}
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
