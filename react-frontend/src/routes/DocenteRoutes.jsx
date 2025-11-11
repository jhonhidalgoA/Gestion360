import PrivateRoute from "./PrivateRoute";
import Calificaciones from "../pages/Docente/Calificaciones/Calificaciones";
import Asistencia from "../pages/Docente/Asistencia/Asistencia";
import Planeacion from "../pages/Docente/Planeacion/Planeacion";
import Reportes from "../pages/Docente/Reportes/Reportes";
import Tareas from "../pages/Docente/Tareas/Tareas";
import Comunicacion from "../pages/Docente/Comunicacion/Comunicacion";
import Docente from "../pages/Docente/Docente";

const docenteRoutes = [
  {
    path: "/docente",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Docente />
      </PrivateRoute>
    ),
  },
  {
    path: "/calificaciones",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Calificaciones />
      </PrivateRoute>
    ),
  },
  {
    path: "/asistencia",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Asistencia />
      </PrivateRoute>
    ),
  },
  {
    path: "/planeacion",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Planeacion />
      </PrivateRoute>
    ),
  },
  {
    path: "/reportes",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Reportes />
      </PrivateRoute>
    ),
  },
  {
    path: "/tareas",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Tareas />
      </PrivateRoute>
    ),
  },
  {
    path: "/comunicacion",
    element: (
      <PrivateRoute roles={["docente"]}>
        <Comunicacion />
      </PrivateRoute>
    ),
  },
];

export default docenteRoutes;