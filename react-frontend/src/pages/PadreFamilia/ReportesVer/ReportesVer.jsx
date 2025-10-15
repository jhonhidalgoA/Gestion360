import NavbarModulo from "../../../components/layout/Navbar/NavbarModulo";
import { useNavigate } from "react-router-dom";
import "./ReportesVer.css";
import { FaFileAlt, FaCalendarCheck, FaUserCheck, FaWallet, FaDownload, FaFileDownload } from "react-icons/fa";

const ReportesVer = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/padrefamilia");
  };

  const reportes = [
    {
      id: 1,
      titulo: "Reporte de Calificaciones",
      descripcion: "Período Actual - Octubre 2025",      
      icon: <FaFileAlt size={70} />,
      color: "blue",
    },
    {
      id: 2,
      titulo: "Reporte de Asistencias",
      descripcion: "Período Actual - Octubre 2025",     
      icon: <FaCalendarCheck size={70}  />,
      color: "purple",
    },
    {
      id: 3,
      titulo: "Reporte Observador",
      descripcion: "Período Actual - Octubre 2025",     
      icon: <FaUserCheck size={70} />,
      color: "green",
    },
    {
      id: 4,
      titulo: "Estado de Cuenta",
      descripcion: "Historial de Pagos 2025",      
      icon: <FaWallet size={70} />,
       color: "pink",
    },
     {
      id: 4,
      titulo: "Certificado Escolar",
      descripcion: "Año 2025",      
      icon: <FaFileDownload size={70} />,
       color: "orange",
    },
  ];

  return (
    <div className="report-view">
      <NavbarModulo />
      <div className="page-container">
        <div className="page-content">
          <div className="header-section">
            <button onClick={handleBack} className="back-button">
              <span className="back-icon">←</span>
              Volver al inicio
            </button>
          </div>

          <div className="page-title">
            <h4>Reportes Académicos</h4>
          </div>

          <div className="reports-grid">
            {reportes.map((reporte) => (
              <div key={reporte.id} className="report-card">
                <div className="icon-container">{reporte.icon}</div>
                <h3 className="report-title">{reporte.titulo}</h3>
                <p className="report-description">{reporte.descripcion}</p>
                <button className={`btn-download ${reporte.color}`}>
                  <FaDownload className="download-icon" />
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesVer;
