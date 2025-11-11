import "./Recursos.css";
import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import { useNavigate } from "react-router-dom";
import RecursosCard from "../../../components/ui/RecursosCard";
import LibraryIcon from "../../../assets/student-img/biblioteca.png"
import CamaraIcon from "../../../assets/student-img/camara.png"
import NotesIcon from "../../../assets/student-img/notas.png"
import CircleIcon from "../../../assets/student-img/concentrico.png"


const Recursos = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/estudiante");
  };

  const resources = [
    {
      id: 1,
      subject: "Biblioteca Digital",
      subtitle: "Acceso a libros y recursos educativos",
      icon: LibraryIcon,
      gradientStart: "#8A2BE2"
      
    },
    {
      id: 2,
      subject: "Videos Educativos",
      subtitle: "Tutoriales y clases grabadas",
      icon: CamaraIcon,
      gradientStart: "#FF6347"
     
    },
     {
      id: 3,
      subject: "Material de Estudio",
      subtitle: "Guías, resúmenes y apuntes",
      icon: NotesIcon,
      gradientStart:"#FFD700"      
    },
    {
      id: 4,
      subject: "Ejercicios Interactivos",
      subtitle: "Practica con ejercicios en línea",
      icon: CircleIcon,
      gradientStart: "#3A6DD8"
      
    }
   
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
        <h4>Recursos Educativos</h4>
      </div>
      <div className="tasks-grid-schedule resourses">
        {resources.map((rec) => (
          <RecursosCard
            key={rec.id}
            subject={rec.subject}
            icon={rec.icon}
            subtitle={rec.subtitle}
            gradientStart={rec.gradientStart}            
          />
        ))}
      </div>
    </div>
  );
};

export default Recursos;
