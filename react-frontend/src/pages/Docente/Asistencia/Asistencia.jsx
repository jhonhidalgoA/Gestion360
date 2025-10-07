import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import "../Calificaciones/Calificaciones";
import "./Asitencia.css"
import ActionButtons from "../../../components/ui/Botones";


const Asistencia = () => {
  return (
    <div className="ratings">
        <NavbarDocente
        title="Asistencia"
        color="#32cd32"
        icon={
          <span className="material-symbols-outlined navbars-icon">
           app_registration
          </span>
        }
      />
      <div className="ratings-container">
        <form action="" method="post" className="ratings-form" >
             <div className="form-row">
            <div className="form-group">
              <div className="form-inputs"></div>
              <label htmlFor="grupo">Grupo:</label>
              <select id="grupo">
                <option value="">Seleccionar</option>
                <option value="6">Grado Sexto</option>
                <option value="7">Grado Séptimo</option>
                <option value="8">Grado Octavo</option>
                <option value="9">Grado Noveno</option>
                <option value="10">Grado Décimo</option>
                <option value="11">Grado Undécimo</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="asignatura">Asignatura:</label>
              <select id="asignatura">
                <option value="">Seleccionar</option>
                <option value="matematicas">Matemáticas</option>
                <option value="ingles">Inglés</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="periodo">Periodo:</label>
              <select id="periodo">
                <option value="">Seleccionar</option>
                <option value="1">Periodo 1</option>
                <option value="2">Periodo 2</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <ActionButtons
              onLoad={() => console.log("Cargar")}
              onSave={() => console.log("Guardar")}
              onView={() => console.log("Guardar calificaciones")}
            />
          </div>
        </form>
         <div className="table-header table-assistance">
          <div>APELLIDOS</div>
          <div>NOMBRES</div>
          <div>FALLAS</div>
          <div>RETARDOS</div>
          <div>OBSERVACIONES</div>          
        </div>
      </div>      
    </div>
  )
}

export default Asistencia
