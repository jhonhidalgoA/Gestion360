import { Link } from "react-router-dom";
import "./AdministradorCard.css";

const AdminCard = ({ icon, title, path, gradient }) => {
  return (
    <li className="card-item">
      <Link to={path} className="card-link">
        <div
          className="card-content"
          style={{
            backgroundImage: gradient,            
            height:"220px",                               
            borderRadius: "12px",
            border: "none",
          }}
        >
          <span className="material-symbols-outlined icons-admin">{icon}</span>
          <h2>{title}</h2>
        </div>
      </Link>
    </li>
  );
};

export default AdminCard;