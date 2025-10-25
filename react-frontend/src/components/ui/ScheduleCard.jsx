import "./ScheduleCard.css";

const ScheduleCard = ({ subject, icon, n1, n2, n3, n4, average, color }) => {
  return (
    <div className="schedule-card-student" style={{ backgroundColor: color }}>
      <div className="header-card-student">
        {icon && (
          <img
            src={icon}
            alt={subject}
            className="subject-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/28?text=?";
            }}
          />
        )}
        <h3 className="subject-title">{subject}</h3>
      </div>
      <div className="grades-section">
        <div className="grade-item">
          <span className="grade-label">Nota 1</span>
          <span className="grade-value">{n1}</span>
        </div>
        <div className="grade-item">
          <span className="grade-label">Nota 2</span>
          <span className="grade-value">{n2}</span>
        </div>
        <div className="grade-item">
          <span className="grade-label">Nota 3</span>
          <span className="grade-value">{n3}</span>
        </div>
        <div className="grade-item">
          <span className="grade-label">Nota 4</span>
          <span className="grade-value">{n4}</span>
        </div>
        <div className="average-section">
          <span className="average-label">Promedio</span>
          <span className="average-value">{average}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
