import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import PlanesCard from "../../../components/ui/PlanesCard";
import "./PlanesVer.css";

const PlanesVer = () => {
  const [planesData, setPlanesData] = useState([]);
  const [filteredPlanes, setFilteredPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const planesPerPage = 4;

  const getIconForAsignatura = (asignatura) => {
    const normalized = (asignatura || '').toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e')
      .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    
    const icons = {
      'matematicas': 'functions',
      'geometria' : 'format_shapes',
      'estadistica' : 'statistics',
      'ciencias': 'science',
      'espanol': 'public',
      'ingles': 'translate',
      'historia': 'history',
      'geografia': 'location_on',
      'fisica': 'lightbulb',
      'quimica': 'chemistry',
      'biologia': 'biotech',
      'tecnologia': 'memory',
      'arte': 'palette',
      'musica': 'music_note',
      'educacion_fisica': 'fitness_center',
    };
    return icons[normalized] || 'description';
  };

  // Cargar planes con useCallback
  const cargarPlanes = useCallback((termino = "") => {
    const username = user?.username || localStorage.getItem('username');
    const token = user?.accessToken || localStorage.getItem('accessToken');
    
    if (!username || !token) {
      setLoading(false);
      return;
    }

    // Si hay término de búsqueda, usar endpoint de búsqueda
    const endpoint = termino 
      ? `http://127.0.0.1:8000/api/planes/buscar?username=${username}&termino=${encodeURIComponent(termino)}`
      : `http://127.0.0.1:8000/api/planes/mis-planes?username=${username}`;

    fetch(endpoint, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPlanesData(data);
        setFilteredPlanes(data);
        setLoading(false);
        setCurrentPage(1); // Resetear a primera página
      })
      .catch(err => {
        console.error("Error al cargar planes:", err);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    cargarPlanes();
  }, [cargarPlanes]);

  // Manejar búsqueda en tiempo real
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length === 0) {
      setFilteredPlanes(planesData);
    } else {
      const filtered = planesData.filter(plan => {
        const searchLower = term.toLowerCase();
        return (
          plan.asignatura?.toLowerCase().includes(searchLower) ||
          plan.grado?.toLowerCase().includes(searchLower) ||
          plan.periodo?.toLowerCase().includes(searchLower) ||
          plan.plan?.toLowerCase().includes(searchLower) ||
          plan.name?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPlanes(filtered);
      setCurrentPage(1);
    }
  };

  // Función para buscar en el backend
  const handleSearchSubmit = () => {
    if (searchTerm.length >= 2) {
      cargarPlanes(searchTerm);
    }
  };

  // Función para ver PDF
  const handleVerPlan = (planId) => {    
    const pdfUrl = `http://127.0.0.1:8000/api/pdf/plan-clase/${planId}`;
    
    // Abrir en nueva pestaña
    window.open(pdfUrl, '_blank');
  };

  // Función para editar plan
  const handleEditarPlan = (planId) => {
    navigate(`/docente/planes/editar/${planId}`);
  };

  // Función para eliminar plan
  const handleEliminarPlan = async (planId, planName) => {
    if (!window.confirm(`¿Estás seguro de eliminar el plan "${planName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const username = user?.username || localStorage.getItem('username');
    const token = user?.accessToken || localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/planes/${planId}?username=${username}`,
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar');
      }

      // Recargar la lista
      cargarPlanes(searchTerm);
      alert("Plan eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando plan:", error);
      alert(error.message || "Error al eliminar el plan");
    }
  };

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredPlanes.length / planesPerPage));
  const startIndex = (currentPage - 1) * planesPerPage;
  const currentPlanes = filteredPlanes.slice(startIndex, startIndex + planesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
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
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando planes...</p>
        </main>
      </>
    );
  }

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
            placeholder="Buscar por materia, grado, periodo o tipo (clase/taller/proyecto/nivelación/habilitación)..." 
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.length >= 2) {
                handleSearchSubmit();
              }
            }}
          />
          <button 
            onClick={handleSearchSubmit}
            disabled={searchTerm.length < 2}
            className="search-button"
            title="Buscar"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          {searchTerm.length > 0 && (
            <button 
              onClick={() => {
                setSearchTerm("");
                cargarPlanes();
              }}
              className="search-button clear-button"
              title="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className="planes-container">
          {filteredPlanes.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              {searchTerm ? 'No se encontraron planes con ese criterio.' : 'No tienes planes creados.'}
            </p>
          ) : (
            currentPlanes.map(plan => (
              <PlanesCard
                key={plan.id}
                icon={getIconForAsignatura(plan.asignatura)}
                name={plan.name}
                asignatura={plan.asignatura}
                grado={plan.grado}
                periodo={plan.periodo}
                datestart={plan.datestart}
                dateEnd={plan.dateEnd}
                plan={plan.plan}
                onVer={() => handleVerPlan(plan.id)}
                onEditar={() => handleEditarPlan(plan.id)}
                onEliminar={() => handleEliminarPlan(plan.id, plan.name)}
              />
            ))
          )}
        </div>

        {/* Paginación centrada */}
        {filteredPlanes.length > planesPerPage && (
          <div className="pagination">
            <p className="pagination-info">
              Página {currentPage} de {totalPages}
            </p>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default PlanesVer;