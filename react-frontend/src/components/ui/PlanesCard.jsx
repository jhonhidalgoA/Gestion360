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
}) => {
  // Formatear fechas al estilo anglosajón: "Nov 3 – 17, 2025"
  const formatDateRange = (start, end) => {
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
        <button>
          <span className="material-symbols-outlined icons-planes-right">
            visibility
          </span>
        </button>
        <button>
          <span className="material-symbols-outlined icons-planes-right">
            edit
          </span>
        </button>
        <button>
          <span className="material-symbols-outlined icons-planes-right">
            delete
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanesCard;
