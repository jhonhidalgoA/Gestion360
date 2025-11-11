import "./InstitucionalCard.css";

const ScheduleCard = ({ icon, title, subtitle, linkText = "",}) => {
  return (
    <div className="schedules-card">
      <div className="schedule-icon">
        <span className="material-symbols-outlined icon ">{icon}</span>
      </div>
      <h4 className="schedule-title">{title}</h4>
      <h6 className="schedule-subtitle">{subtitle}</h6>
      <p className="schedule-link">{linkText}</p>
    </div>
  );
};

export default ScheduleCard;
