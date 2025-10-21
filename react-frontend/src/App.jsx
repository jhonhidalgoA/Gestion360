import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Páginas principales //
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import InfoMatricula from "./pages/InfoMatricula";
import NoticiasDetalles from "./pages/NoticiasDetalles";
import EventosDetalles from "./pages/EventosDetalles";
import Circulares from "./pages/CircularesDetalles";
import VerManual from "./pages/VerManual";
import VerPEI from "./pages/VerPEI";
import AtencionPadres from "./pages/AtencionPadres";

// Páginas del módulo administrador //
import Matricula from "./pages/Administrador/Matricula/Matricula";
import RegistrarDocente from "./pages/Administrador/RegistrarDocente/RegistrarDocente";
import Calendario from "./components/calendar/Calendar";
import HorarioGrados from "./pages/Administrador/HorarioGrados/HorarioGrados";
import EditarMenu from "./pages/Administrador/EditarMenu/EditarMenu";

// Páginas del módulo docente //
import Calificaciones from "./pages/Docente/Calificaciones/Calificaciones";
import Asistencia from "./pages/Docente/Asistencia/Asistencia";
import Planeacion from "./pages/Docente/Planeacion/Planeacion";
import Reportes from "./pages/Docente/Reportes/Reportes"
import Tareas from "./pages/Docente/Tareas/Tareas"
import Comunicacion from "./pages/Docente/Comunicacion/Comunicacion"

// Páginas del módulo padre de Familia //
import HorarioVer from "./pages/PadreFamilia/HorarioVer/HorarioVer"
import TareaVer from "./pages/PadreFamilia/TareaVer/TareaVer"
import ReportesVer from "./pages/PadreFamilia/ReportesVer/ReportesVer"


// Páginas del módulo estudiante //



//prueba de navbarAdmin //
import Administrador from "./pages/Administrador/Administrador";
import Docente from "./pages/Docente/Docente";
import PadreFamilia from "./pages/PadreFamilia/PadreFamilia";
import Estudiante from "./pages/Estudiante/Estudiante"


const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const scrollToSection = () => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth",
          });
        }
      };
      setTimeout(() => {
        requestAnimationFrame(scrollToSection);
      }, 100);
    }
  }, [location]);

  return null;
};

function App() {
  const [playState, setPlayState] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToSection />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage playState={playState} setPlayState={setPlayState} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/info-matricula" element={<InfoMatricula />} />
        <Route path="/noticia-detalle" element={<NoticiasDetalles />} />
        <Route path="/evento-detalle" element={<EventosDetalles />} />
        <Route path="/circulares" element={<Circulares />} />
        <Route path="/manual-convivencia" element={<VerManual />} />
        <Route path="/pei" element={<VerPEI />} />
        <Route path="administrador" element={<Administrador />} />
        <Route path="docente" element={<Docente />} />
        <Route path="/matricula" element={<Matricula />} />
        <Route path="/registro-docente" element={<RegistrarDocente />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/atencion-padres" element={<AtencionPadres />} />
        <Route path="/horario-grados" element={<HorarioGrados />} />
        <Route path="/menu-escolar" element={<EditarMenu />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/asistencia" element={<Asistencia />} />
        <Route path="/planeacion" element={<Planeacion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/comunicacion" element={<Comunicacion />} />
        <Route path="padrefamilia" element={<PadreFamilia />} />
        <Route path="horario-ver" element={<HorarioVer />} />
        <Route path="tarea-ver" element={<TareaVer />} />
        <Route path="reportes-ver" element={<ReportesVer />} />
        <Route path="estudiante" element={<Estudiante />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
