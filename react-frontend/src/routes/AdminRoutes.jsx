import PrivateRoute from "./PrivateRoute";
import Administrador from "../pages/Administrador/Administrador";
import Matricula from "../pages/Administrador/Matricula/Matricula";
import RegistrarDocente from "../pages/Administrador/RegistrarDocente/RegistrarDocente";
import HorarioGrados from "../pages/Administrador/HorarioGrados/HorarioGrados";
import EditarMenu from "../pages/Administrador/EditarMenu/EditarMenu";
import Calendario from "../components/calendar/Calendar";

const adminRoutes = [
  {
    path: "/administrador",
    element: (
      <PrivateRoute roles={["administrador", "Administrador"]}> 
        <Administrador />
      </PrivateRoute>
    ),
  },
  {
    path: "/matricula",
    element: (
      <PrivateRoute roles={["Administrador"]}>
        <Matricula />
      </PrivateRoute>
    ),
  },
  {
    path: "/registro-docente",
    element: (
      <PrivateRoute roles={["Administrador"]}>
        <RegistrarDocente />
      </PrivateRoute>
    ),
  },
  {
    path: "/horario-grados",
    element: (
      <PrivateRoute roles={["Administrador"]}>
        <HorarioGrados />
      </PrivateRoute>
    ),
  },
  {
    path: "/menu-escolar",
    element: (
      <PrivateRoute roles={["Administrador"]}>
        <EditarMenu />
      </PrivateRoute>
    ),
  },
  {
    path: "/calendario",
    element: (
      <PrivateRoute roles={["Administrador"]}>
        <Calendario />
      </PrivateRoute>
    ),
  },
];


export default adminRoutes;
