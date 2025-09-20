import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import InfoMatricula from "./pages/InfoMatricula";
import NoticiasDetalles from "./pages/NoticiasDetalles";
import EventosDetalles from "./pages/EventosDetalles";
import Circulares from "./pages/CircularesDetalles";
import VerManual from "./pages/VerManual";
import VerPEI from "./pages/VerPEI";

//prueba de navbarAdmin //
import Administrador from "./pages/Administrador";
import Docente from "./pages/Docente"

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
        <Route path="/" element={<HomePage playState={playState} setPlayState={setPlayState} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/info-matricula" element={<InfoMatricula />} />
        <Route path="/noticia-detalle" element={<NoticiasDetalles />} />
        <Route path="/evento-detalle" element={<EventosDetalles />} />
        <Route path="/circulares" element={<Circulares />} />
        <Route path="/manual-convivencia" element={<VerManual />} />
        <Route path="/pei" element={<VerPEI />} />
        <Route path="administrador" element={<Administrador/>} />
        <Route path="docente" element={<Docente/>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;