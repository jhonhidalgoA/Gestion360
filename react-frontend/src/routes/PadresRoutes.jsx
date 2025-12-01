import PrivateRoute from "./PrivateRoute";
import PadreFamilia from "../pages/PadreFamilia/PadreFamilia";
import TareaVer from "../pages/PadreFamilia/TareaVer/TareaVer";
import ReportesVer from "../pages/PadreFamilia/ReportesVer/ReportesVer";

const padresRoutes = [
  {
    path: "/padres",
    element: (
      <PrivateRoute roles={["padre"]}>
        <PadreFamilia />
      </PrivateRoute>
    ),
  },
  {
    path: "/tarea-ver",
    element: (
      <PrivateRoute roles={["padre"]}>
        <TareaVer />
      </PrivateRoute>
    ),
  },
  {
    path: "/reportes-ver",
    element: (
      <PrivateRoute roles={["padre"]}>
        <ReportesVer />
      </PrivateRoute>
    ),
  },
];

export default padresRoutes;