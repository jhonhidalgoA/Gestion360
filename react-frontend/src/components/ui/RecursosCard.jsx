import "./RecursosCard.css";

const Recursos = ({ subject, icon, subtitle, gradientStart }) => {
  return (
    <div
      className="schedule-card-student"
      style={{
        background: `linear-gradient(135deg, ${gradientStart})`,
      }}
    >
      <div className="header-card-student resources ">
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
        
      </div>
      <div className="title-resourses">
          <h3 className="resourses-title">{subject}</h3>
          <h4 className="resources-description">{subtitle}</h4>
        </div>
    </div>
  );
};

export default Recursos;
