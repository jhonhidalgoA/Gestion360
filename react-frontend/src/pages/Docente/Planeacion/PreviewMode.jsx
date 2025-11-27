import "./PreviewMode.css";

const PreviewMode = ({
  getValues,
  grupos,
  asignaturas,
  periodos,
  tipoOptions,
  estandarOptions,
  dbaOptions,
  evidenciaOptions,
  proyectoOptions,
  onEdit,
  onSave,
}) => {
  // Función segura para obtener label, incluso si los datos están cargando
  const getLabel = (options, value) => {

    // Si solo hay un elemento y dice "Cargando" o "Error", no busques
    if (options.length === 1) {
      const label = options[0].label;
      if (label === "Cargando..." || label.startsWith("Error")) {
        return "–";
      }
    }
    const option = options.find(opt => opt.value === value);
    return option ? option.label : "–";
  };

  return (
    <div className="preview-container">
      <h2>Vista Previa del Plan de Clase</h2>

      <div className="preview-section">
        <h3>
          <span className="material-symbols-outlined icon-planning">calendar_month</span>
          Información Básica
        </h3>
        <p><strong>Fecha Inicio:</strong> {getValues("fecha_inicio") || "–"}</p>
        <p><strong>Fecha Fin:</strong> {getValues("fecha_fin") || "–"}</p>
        <p><strong>Periodo:</strong> {getLabel(periodos, getValues("periodo"))}</p>
        <p><strong>Grupo:</strong> {getLabel(grupos, getValues("grupo"))}</p>
        <p><strong>Asignatura:</strong> {getLabel(asignaturas, getValues("asignatura"))}</p>
        <p><strong>Tipo:</strong> {getLabel(tipoOptions, getValues("tipo"))}</p>
        <p><strong>Tema:</strong> {getValues("tema") || "–"}</p>
      </div>

      <div className="preview-section">
        <h3>
          <span className="material-symbols-outlined icon-planning">ads_click</span>
          Estándares y DBA
        </h3>
        <p><strong>Estándar:</strong> {getLabel(estandarOptions, getValues("estandar"))}</p>
        <p><strong>DBA:</strong> {getLabel(dbaOptions, getValues("dba"))}</p>
        <p><strong>Evidencia:</strong> {getLabel(evidenciaOptions, getValues("evidencia"))}</p>
        <p><strong>Competencias:</strong> {getValues("competencias") || "–"}</p>
        <p><strong>Objetivos:</strong> {getValues("objetivos") || "–"}</p>
        <p><strong>Proyecto:</strong> {getLabel(proyectoOptions, getValues("proyecto"))}</p>
      </div>

      <div className="preview-section">
        <h3>
          <span className="material-symbols-outlined icon-planning">psychology</span>
          Actividades y Desarrollo de la Clase
        </h3>
        <p><strong>Saberes Previos:</strong> {getValues("saberes_previos") || "–"}</p>
        <p><strong>Analiza:</strong> {getValues("analiza") || "–"}</p>
       
      </div>

      <div className="preview-section">
        <h3>
          <span className="material-symbols-outlined icon-planning">content_copy</span>
          Contenidos y Evaluación
        </h3>       
        <p><strong>Contenidos:</strong> {getValues("contenidos") || "–"}</p>
        <p><strong>Evaluación:</strong> {getValues("evaluacion") || "–"}</p>
      </div>

      <div className="preview-section">
        <h3>
          <span className="material-symbols-outlined icon-planning">add_link</span>
          Recursos y Observaciones
        </h3>
        <p><strong>Observaciones:</strong> {getValues("observaciones") || "–"}</p>
        <p><strong>Bibliografía:</strong> {getValues("bibliografia") || "–"}</p>
      </div>

      <div className="preview-actions">
        <button className="btn btn-secondary" onClick={onEdit}>
          <span className="material-symbols-outlined icon-prev">arrow_back</span>
          Editar
        </button>
        <button className="btn btn-success" onClick={onSave}>
          <span className="material-symbols-outlined icon-prev">save</span>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default PreviewMode;