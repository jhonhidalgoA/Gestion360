import "./PlanesCard.css";

const PlanesCard = ({
  icon,
  name,
  asignatura,
  grado,
  periodo,
  datestart,
  dateEnd,
  plan,
  onVer,      // ← Recibir las funciones
  onEditar,   // ← Recibir las funciones
  onEliminar  // ← Recibir las funciones
}) => {
  // Formatear fechas al estilo anglosajón: "Nov 3 – 17, 2025"
  const formatDateRange = (start, end) => {
    if (!start || !end) return 'Fechas no disponibles';
    
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const startPart = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const endPart = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return `${startPart} – ${endPart}`;
    } catch (error) {
      console.error("Error formateando fechas:", error);
      return 'Fechas no disponibles';
    }
  };

  return (
    <div className="planes-card">
      <div className="planes-icon">
        <span className="material-symbols-outlined icon-planes">{icon}</span>
      </div>
      <div className="planes-name">
        <h3 className="planes-title">Tema: {name}</h3>

        {/* Fecha formateada */}
        <div className="planes-date">
          <span className="material-symbols-outlined icon-planes-date">
            calendar_month
          </span>
          <span className="tag fechas">
            {formatDateRange(datestart, dateEnd)}
          </span>
        </div>       
        <div className="plan-tags">
          <span className="tag materia">{asignatura}</span>
          <span className="tag grado">{grado}</span>
          <span className="tag periodo">{periodo}</span>
          <span className="tag plan">{plan}</span>
        </div>
      </div>
      <div className="planes-button">
        {/* Botón VER - Conectado a onVer */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onVer && onVer();
          }}
          title="Ver PDF del plan"
        >
          <span className="material-symbols-outlined icons-planes-right">
            visibility
          </span>
        </button>

        {/* Botón EDITAR - Conectado a onEditar */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEditar && onEditar();
          }}
          title="Editar plan"
        >
          <span className="material-symbols-outlined icons-planes-right">
            edit
          </span>
        </button>

        {/* Botón ELIMINAR - Conectado a onEliminar */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEliminar && onEliminar();
          }}
          title="Eliminar plan"
        >
          <span className="material-symbols-outlined icons-planes-right">
            delete
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanesCard;