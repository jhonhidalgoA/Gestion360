import "./MisCalificaciones.css"
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import ScheduleCard from "../../../components/ui/ScheduleCard"
import { useNavigate } from "react-router-dom";
import MathIcon from "../../../assets/student-img/herramientas.png"
import ScienceIcon from "../../../assets/student-img/ciencias.png"
import BookIcon from "../../../assets/student-img/libro.png"
import EnglishIcon from "../../../assets/student-img/globo.png"
import EarthIcon from "../../../assets/student-img/mundo.png"
import ArtIcon from "../../../assets/student-img/paletas.png"
import BallIcon from "../../../assets/student-img/balon.png"
import PcIcon from "../../../assets/student-img/pc.png"
import EticIcon from "../../../assets/student-img/etica.png"



const Tareashacer = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/estudiante");
  };

  const subjects = [
    { id: 1, subject: "Matemáticas", icon: MathIcon, n1: 3.5, n2: 4.0, n3: 3.8, average: 3.8, color: "#FF6347" },
    { id: 2, subject: "Español y Literatura", icon: BookIcon, n1: 9.2, n2: 8.7, n3: 9.0, average: 9.0, color: "#8A2BE2" },
    { id: 3, subject: "Ciencias Naturales", icon: ScienceIcon, n1: 7.8, n2: 8.2, n3: 8.5, average: 8.2, color: "#1E90FF" },
    { id: 4, subject: "Inglés", icon: EnglishIcon, n1: 9.5, n2: 9.3, n3: 9.6, average: 9.5, color: "#32CD32" },
    { id: 5, subject: "Ciencias Sociales", icon: EarthIcon, n1: 8.0, n2: 8.5, n3: 8.3, average: 8.3, color: "#FFD700" },
    { id: 6, subject: "Artistica", icon: ArtIcon, n1: 9.8, n2: 9.6, n3: 9.9, average: 9.8, color: "#FF8C00" },
    { id: 7, subject: "Educación Física", icon: BallIcon, n1: 10, n2: 10, n3: 10, average: 10, color: "#FF69B4" },
    { id: 8, subject: "Tecnología", icon: PcIcon, n1: 8.7, n2: 9.1, n3: 8.9, average: 8.9, color: "#00CED1" },
    { id: 9, subject: "Ética", icon: EticIcon, n1: 9.0, n2: 9.2, n3: 9.1, average: 9.1, color: "#00C9A7" },
  ];


  return (
    <div className="schedules-containers">
      <NavbarModulo />
      <div className="page-container">
        <button onClick={handleBack} className="back-button">
          <span className="back-icon">←</span>
          Volver al inicio
        </button>
      </div>
      <div className="page-title">
        <h4>Mis Calificaciones</h4>
      </div>
      <div className="tasks-grid-schedule">
        {subjects.map((subject) => (
          <ScheduleCard
            key={subject.id}
            subject={subject.subject}
            icon={subject.icon}
            n1={subject.n1}
            n2={subject.n2}
            n3={subject.n3}
            average={subject.average}
            color={subject.color}
          />
        ))}
      </div>
    </div>
    
  );
};

export default Tareashacer;