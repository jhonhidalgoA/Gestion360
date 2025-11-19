import PrivateRoute from "./PrivateRoute";
import HorarioEstudiante from "../pages/Estudiante/Horario/HorarioEstudiante";
import Estudiante from "../pages/Estudiante/Estudiante";
import TareasHacer from "../pages/Estudiante/TareasHacer/Tareashacer";
import CalificacionesEstudiante from "../pages/Estudiante/MisCalificaciones/MisCalificaciones";
import Recursos from "../pages/Estudiante/Recursos/Recursos";

const estudianteRoutes = [
  {
    path: "/estudiante",
    element: (
      <PrivateRoute roles={["estudiante"]}>
        <Estudiante />
      </PrivateRoute>
    ),
  },
  {
    path: "/tareas-hacer",
    element: (
      <PrivateRoute roles={["estudiante"]}>
        <TareasHacer />
      </PrivateRoute>
    ),
  },
  {
    path: "/calificaciones-estudiante",
    element: (
      <PrivateRoute roles={["estudiante", "padre"]}>
        <CalificacionesEstudiante />
      </PrivateRoute>
    ),
  },
  {
    path: "/recursos",
    element: (
      <PrivateRoute roles={["estudiante"]}>
        <Recursos />
      </PrivateRoute>
    ),
  },
  {
    path: "/estudiante/horario",
    element: (
      <PrivateRoute roles={["estudiante"]}>
        <HorarioEstudiante />
      </PrivateRoute>
    ),
  },
];

export default estudianteRoutes;
