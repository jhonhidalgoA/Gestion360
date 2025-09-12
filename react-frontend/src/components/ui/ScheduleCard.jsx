import "./ScheduleCard.css";

const ScheduleCard = ({ icon, title, linkText = "Saber más...",}) => {
  return (
    <div className="schedule-card">
      <div className="schedule-icon">
        <span className="material-symbols-outlined icon ">{icon}</span>
      </div>
      <h4 className="schedule-title">{title}</h4>
      <p className="schedule-link">{linkText}</p>
    </div>
  );
};

export default ScheduleCard;
