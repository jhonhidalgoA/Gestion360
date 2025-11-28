import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import PlanesCard from "../../../components/ui/PlanesCard";
import "./PlanesVer.css"

const PlanesVer = () => {
  const planesData = [
    {
      icon: "functions",
      name: "Matemáticas Básicas",
      asignatura: "Matemáticas",
      grado: "5° Grado",
      periodo: "Periodo 2",
      datestart: "15-Feb-2025",
      dateEnd: "30-Mar-2025",
      plan: "Clase",
      
    },
    {
      icon: "science",
      name: "Ciencias Naturales",
      asignatura: "Ciencias",
      grado: "6° Grado",
      periodo: "Periodo 3",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Taller"
    },
    {
      icon: "public",
      name: "Lenguaje",
      asignatura: "Español",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Recuperación"
    },
    {
      name: "Ingles Básico",
      asignatura: "Ingles",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Proyecto"
    }
  ];
  return (
    <>
        <NavbarDocente
        title="Mis Planes de Clase"
        color="#9c27b0"
        icon={
          <span className="material-symbols-outlined navbars-icon">
            checklist_rtl
          </span>
        }
      />
      <main className="main-content">         
         <div className="planes-container">
          {planesData.map((plan, index) => (
            <PlanesCard
              key={index} 
              icon={plan.icon || "description"}
              name={plan.name}
              asignatura={plan.asignatura}
              grado={plan.grado}
              periodo={plan.periodo}
              datestart={plan.datestart}
              dateEnd={plan.dateEnd}
              plan={plan.plan}              
            />
          ))}
        </div>
      </main>
      
    </>
  )
}

export default PlanesVer
