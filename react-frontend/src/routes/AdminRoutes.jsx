import PrivateRoute from "./PrivateRoute";
import Administrador from "../pages/Administrador/Administrador";
import Matricula from "../pages/Administrador/Matricula/Matricula";
import RegistrarDocente from "../pages/Administrador/RegistrarDocente/RegistrarDocente";
import HorarioGrados from "../pages/Administrador/HorarioGrados/HorarioGrados";
import EditarMenu from "../pages/Administrador/EditarMenu/EditarMenu";
import VerHorarios from "../pages/Administrador/HorarioGrados/VerHorariosGrados"
import Calendario from "../components/calendar/Calendar";

const adminRoutes = [
  {
    path: "/administrador",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <Administrador />
      </PrivateRoute>
    ),
  },
  {
    path: "/matricula",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <Matricula />
      </PrivateRoute>
    ),
  },
  {
    path: "/registro-docente",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <RegistrarDocente />
      </PrivateRoute>
    ),
  },
  {
    path: "/horario-grados",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <HorarioGrados />
      </PrivateRoute>
    ),
  },

  {
    path: "/horario-ver",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <VerHorarios />
      </PrivateRoute>
    ),
  },
  {
    path: "/menu-escolar",
    element: (
      <PrivateRoute roles={["administrador"]}>
        <EditarMenu />
      </PrivateRoute>
    ),
  },
  
];

export default adminRoutes;
