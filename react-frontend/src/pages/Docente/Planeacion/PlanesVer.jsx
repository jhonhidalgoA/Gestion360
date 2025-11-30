import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import PlanesCard from "../../../components/ui/PlanesCard";
import "./PlanesVer.css";

const PlanesVer = () => {
  const [planesData, setPlanesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getIconForAsignatura = (asignatura) => {
    const normalized = (asignatura || '').toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e')
      .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
    
    const icons = {
      'matematicas': 'functions',
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
      'educacion fisica': 'fitness_center',
    };
    return icons[normalized] || 'description';
  };

  useEffect(() => {
    const username = user?.username || localStorage.getItem('username');
    const token = user?.accessToken || localStorage.getItem('accessToken');
    
    if (!username || !token) {
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/planes/mis-planes?username=${username}`, {
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
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar planes:", err);
        setLoading(false);
      });
  }, [user]);

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
            placeholder="Buscar por materia, grado o periodo ..." 
          />
        </div>

        <div className="planes-container">
          {planesData.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              No tienes planes creados.
            </p>
          ) : (
            planesData.map(plan => (
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
              />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default PlanesVer;