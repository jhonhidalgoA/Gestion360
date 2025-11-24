import "./ModalCalificaciones.css";

const ModalCalificaciones = ({ isOpen, onClose, modalData }) => {
  if (!isOpen) return null;

  // Calcular estadísticas
  const calcularEstadisticas = (notas) => {
    const notasValidas = notas.filter(nota => nota !== "" && nota !== null && !isNaN(parseFloat(nota)));
    if (notasValidas.length === 0) {
      return {
        promedio: 0,
        maxima: 0,
        minima: 0,
        total: 0,
        aprobadas: 0,
        reprobadas: 0
      };
    }

    const notasNumericas = notasValidas.map(nota => parseFloat(nota));
    const promedio = notasNumericas.reduce((a, b) => a + b, 0) / notasNumericas.length;
    const maxima = Math.max(...notasNumericas);
    const minima = Math.min(...notasNumericas);
    const aprobadas = notasNumericas.filter(nota => nota >= 3.0).length;
    const reprobadas = notasNumericas.length - aprobadas;

    return {
      promedio: promedio.toFixed(2),
      maxima: maxima.toFixed(1),
      minima: minima.toFixed(1),
      total: notasValidas.length,
      aprobadas: aprobadas,
      reprobadas: reprobadas
    };
  };

  const estadisticas = modalData ? calcularEstadisticas(modalData.notas) : null;

  const determinarEstado = (nota) => {
    if (nota === "" || nota === null) return { texto: "Pendiente", clase: "pendiente" };
    const notaNum = parseFloat(nota);
    if (notaNum >= 4.5) return { texto: "✓ Aprobado", clase: "excelente" };
    if (notaNum >= 4.0) return { texto: "✓ Aprobado", clase: "buena" };
    if (notaNum >= 3.0) return { texto: "✓ Aprobado", clase: "aceptable" };
    return { texto: "✗ Reprobado", clase: "reprobada" };
  };

  const getClasePromedio = (promedio) => {
    const prom = parseFloat(promedio);
    if (prom >= 4.5) return "promedio-excelente";
    if (prom >= 4.0) return "promedio-buena";
    if (prom >= 3.0) return "promedio-aceptable";
    return "promedio-bajo";
  };

  // Obtener fecha actual para el pie de página
  const obtenerFechaActual = () => {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES');
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `Documento generado el ${fecha} a las ${hora}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón de cerrar con icono */}
        <button
          onClick={onClose}
          className="modal-close-btn"
        >
          <span className="material-symbols-outlined">close</span>
        </button>       
       <div class="header">
            <div class="titulo-principal">COLEGIO STEM 360</div>
            <div class="subtitulo">REPORTE DE CALIFICACIONES</div>
            <div class="linea-decorativa"></div>
        </div>

        {/* Información del estudiante en formato vertical */}
        <div className="info-estudiante">
          <div className="info-row">
            <div className="info-label"> ESTUDIANTE:</div>
            <div className="info-value">{modalData?.nombre || "N/A"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">DOCUMENTO:</div>
            <div className="info-value">{modalData?.documento || "N/A"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">GRADO:</div>
            <div className="info-value">{modalData?.grado || "N/A"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">ASIGNATURA:</div>
            <div className="info-value">{modalData?.asignatura || "N/A"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">PERIODO:</div>
            <div className="info-value">{modalData?.periodo || "N/A"}</div>
          </div>
        </div>

        {/* Detalle de calificaciones */}
        <div className>
          <h3 className="section-title">DETALLE DE CALIFICACIONES</h3>
          <table className="tabla-calificaciones">
            <thead>
              <tr>
                <th>N°</th>
                <th>COLUMNA</th>
                <th>NOTA</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {modalData?.notas.map((nota, index) => {
                const estado = determinarEstado(nota);
                return (
                  <tr key={index}>
                    <td><strong>{index + 1}</strong></td>
                    <td>Nota {index + 1}</td>
                    <td className={`nota-${estado.clase}`}>
                      {nota && nota !== "" ? parseFloat(nota).toFixed(1) : "—"}
                    </td>
                    <td className={`estado-${estado.clase}`}>
                      {estado.texto}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Línea separadora */}
        <div className="linea-separadora"></div>

        {/* Resumen estadístico */}
        <div className="statistics-section">
          <h3 className="section-title">RESUMEN ESTADÍSTICO</h3>
          <table className="estadisticas-tabla">
            <thead>
              <tr>
                <th>Promedio</th>
                <th>Nota Máxima</th>
                <th>Nota Mínima</th>
                <th>Total Notas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={getClasePromedio(estadisticas?.promedio)}>{estadisticas?.promedio || "0.00"}</td>
                <td className="promedio-excelente">{estadisticas?.maxima || "0.0"}</td>
                <td className="promedio-bajo">{estadisticas?.minima || "0.0"}</td>
                <td>{estadisticas?.total || "0"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rendimiento */}
        <div className="rendimiento">
          <div className="rendimiento-item rendimiento-aprobadas">
            <strong>Aprobadas:</strong> {estadisticas?.aprobadas || "0"}
          </div>
          <div className="rendimiento-item rendimiento-reprobadas">
            <strong>Reprobadas:</strong> {estadisticas?.reprobadas || "0"}
          </div>
        </div>        

        {/* Pie de página */}
        <div className="pie-pagina">
          {obtenerFechaActual()}
        </div>

        <div className="footer-info">
          <span>Colegio STEM 360</span>
          <span>Página 1 de 1</span>
        </div>

        {/* Botones de acción */}
        <div className="modal-actions">
          <button 
            onClick={() => alert("Enviar por Email (no implementado)")}
            className="modal-btn modal-btn-email"
          >
            <span className="material-symbols-outlined">email</span> Enviar por Email
          </button>

          <button 
            onClick={() => window.print()}
            className="modal-btn modal-btn-print"
          >
            <span className="material-symbols-outlined">print</span> Imprimir
          </button>

          <button 
            onClick={() => alert("Descargar PDF (no implementado)")}
            className="modal-btn modal-btn-download"
          >
            <span className="material-symbols-outlined">download</span> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCalificaciones;