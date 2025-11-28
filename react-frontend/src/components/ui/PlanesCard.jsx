import "./PlanesCard.css";
import ActionButtons from "../ui/Botones";

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
  const handleEditarPlanes = () => {
    console.log("Cargar estudiantes");
  };

  const handleBorrarPlanes = () => {
    console.log("Borrar estudiantes");
  };

  const loading = {
    cargar: false,
    guardar: false,
  };

  return (
    <>
      <div className="planes-card">
        <div className="planes-icon">
          <span class="material-symbols-outlined icon-planes">{icon}</span>
        </div>
        <div className="planes-name">
          <h3 className="planes-title">{name}</h3>
          <div className="planes-subtitle">
            <p className="subject">{asignatura}</p>
            <p>{grado}</p>
            <p>{periodo}</p>
          </div>
          <div className="planes-date">
            <span class="material-symbols-outlined icon-planes-date">
              calendar_month
            </span>
            <p>{datestart}</p>
            <p>{dateEnd}</p>
          </div>
          <div className="planes-type">
            <p>{plan} </p>
          </div>
        </div>
        <div className="planes-buttom">
          <ActionButtons
            onEdit={handleEditarPlanes}
            editLoading={loading.cargar}
            editLabel="Editar"
            onDelete={handleBorrarPlanes}
            deleteLoading={loading.borrar}
            deleteLabel="Borrar"
          />
        </div>
      </div>
    </>
  );
};

export default PlanesCard;
