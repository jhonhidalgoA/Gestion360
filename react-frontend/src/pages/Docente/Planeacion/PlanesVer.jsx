import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import PlanesCard from "../../../components/ui/PlanesCard";
import "./PlanesVer.css";
import { useState } from "react";

const PlanesVer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      plan: "Taller",
    },
    {
      icon: "public",
      name: "Lenguaje",
      asignatura: "Español",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Recuperación",
    },
    {
      name: "Ingles Básico",
      asignatura: "Ingles",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Proyecto",
    },
    {
      icon: "public",
      name: "Lenguaje",
      asignatura: "Español",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Recuperación",
    },
    {
      icon: "public",
      name: "Lenguaje",
      asignatura: "Español",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Recuperación",
    },
    {
      icon: "public",
      name: "Lenguaje",
      asignatura: "Español",
      grado: "4° Grado",
      periodo: "Tercer Periodo",
      datestart: "01-Abr-2025",
      dateEnd: "30-Abr-2025",
      plan: "Recuperación",
    },
  ];

  const totalPages = Math.ceil(planesData.length / itemsPerPage);

  // Filtra los planes para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planesData.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
        <div className="planes-search">
           <input type="search" name="" id="" placeholder="Buscar por materia, grado o periodo ..." />
        </div>       
        <div className="planes-container">
          {currentItems.map((plan, index) => (
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
         {/* Paginación */}
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={pageNum === currentPage ? "active" : ""}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return <span key={pageNum}>...</span>;
            }
            return null;
          })}

          <button onClick={nextPage} disabled={currentPage === totalPages}>
            →
          </button>

          <p className="pagination-info">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, planesData.length)} de {planesData.length} planes
          </p>
        </div>

      </main>
    </>
  );
};

export default PlanesVer;
