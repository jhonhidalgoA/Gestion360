import { BrowserRouter } from "react-router-dom";
import { useRoutes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthProvider from "./context/AuthContext"; 
import PrivateRoute from "./routes/PrivateRoute";
import CalendarioUnificado from "./pages/CalendarioUnificado";

// Páginas públicas
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

// Rutas protegidas
import adminRoutes from "./routes/AdminRoutes";
import docenteRoutes from "./routes/DocenteRoutes";
import estudianteRoutes from "./routes/EstudianteRoutes";
import padresRoutes from "./routes/PadresRoutes";

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

function AppContent() {
  const [playState, setPlayState] = useState(false);

  const publicRoutes = [
    {
      path: "/",
      element: <HomePage playState={playState} setPlayState={setPlayState} />,
    },
    { path: "/login", element: <Login /> },
    { path: "/reset", element: <Reset /> },
    { path: "/info-matricula", element: <InfoMatricula /> },
    { path: "/noticia-detalle", element: <NoticiasDetalles /> },
    { path: "/evento-detalle", element: <EventosDetalles /> },
    { path: "/circulares", element: <Circulares /> },
    { path: "/manual-convivencia", element: <VerManual /> },
    { path: "/pei", element: <VerPEI /> },
    { path: "/atencion-padres", element: <AtencionPadres /> },
  ];

  const allRoutes = [
    ...publicRoutes,
    ...adminRoutes,
    ...docenteRoutes,
    ...estudianteRoutes,
    ...padresRoutes,
    {
    path: "/calendario",
    element: (
      <PrivateRoute roles={["administrador", "docente"]}>
        <CalendarioUnificado />
      </PrivateRoute>
    ),
  },
    { path: "*", element: <Login /> },
  ];

  const element = useRoutes(allRoutes);

  return (
    <>
      <ScrollToSection />
      {element}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* ← ENVUELVE AQUÍ */}
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;