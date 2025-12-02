import "./ReporteCard.css";

const ReporteCard = ({ icon, title, subtitle, iconColor, onClick }) => {
  return (
    <div className="reporte-card" onClick={onClick}>
      <div className="reporte-icon">
        <span className="material-symbols-outlined icon" style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="reporte-content">
        <h3 className="reporte-title">{title}</h3>
        <p className="reporte-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default ReporteCard;
