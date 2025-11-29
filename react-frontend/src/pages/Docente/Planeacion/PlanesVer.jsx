import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import PlanesCard from "../../../components/ui/PlanesCard";
import "./PlanesVer.css";
import { useState, useEffect } from "react";

const PlanesVer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [planesData, setPlanesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de asignaturas a íconos de Google Material Symbols
  const asignaturaToIcon = {
    'Matemáticas': 'functions',
    'Ciencias': 'science',
    'Español': 'public',
    'Ingles': 'translate',
    'Historia': 'history',
    'Geografía': 'location_on',
    'Física': 'lightbulb',
    'Química': 'chemistry',
    'Biología': 'biotech',
    'Tecnología': 'memory',
    'Arte': 'palette',
    'Música': 'music_note',
    'Educación Física': 'fitness_center',
  };

  const getIconForAsignatura = (asignatura) => {
    return asignaturaToIcon[asignatura] || 'description';
  };

  // Cargar planes desde la API
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/planes'); // 👈 Asegúrate de usar tu endpoint real
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPlanesData(data);
      } catch (err) {
        setError(err.message || 'Error al cargar los planes');
        console.error('Error fetching planes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  const totalPages = Math.ceil(planesData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planesData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
          <input
            type="search"
            placeholder="Buscar por materia, grado o periodo ..."
          />
        </div>

        {loading && <p>Cargando planes...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && planesData.length === 0 && (
          <p>No se encontraron planes.</p>
        )}

        {!loading && !error && planesData.length > 0 && (
          <>
            <div className="planes-container">
              {currentItems.map((plan, index) => (
                <PlanesCard
                  key={index}
                  icon={getIconForAsignatura(plan.asignatura)}
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

            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
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
                Mostrando {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, planesData.length)} de {planesData.length} planes
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default PlanesVer;