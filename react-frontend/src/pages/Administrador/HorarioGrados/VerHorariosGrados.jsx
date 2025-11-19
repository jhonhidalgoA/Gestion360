
import { useSearchParams } from "react-router-dom";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import VerHorario from "../../../components/horario/VerHorario";
import "./VerHorariosGrados.css"

const VerHorarios = () => {
  const [searchParams] = useSearchParams();
  const gradoIdParam = searchParams.get("gradoId");
  const gradoId = gradoIdParam ? parseInt(gradoIdParam, 10) : null;

  return (
    <div className="schedules-container">
      <NavbarSection title="Ver Horario" color="#0c0c0cff" />
      <div className="page-content">
        {gradoId ? (
          <VerHorario gradoId={gradoId} titulo="Horario del Grado" />
        ) : (
          <p className="error-message">Grado no especificado</p>
        )}
      </div>
    </div>
  );
};

export default VerHorarios;