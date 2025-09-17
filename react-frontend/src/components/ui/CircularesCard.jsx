import "./CircularesCard.css"
import icon_pdf from "../../../src/components/icons/pdf_1.png"

const CircularCard = ({ numero, fecha, descripcion, enlace }) => {
  return (
    <div className="circular-card"> 
      <div className="circular-header">
        <img src={icon_pdf} alt="PDF" className="icon-pdf" />
        <div className="circular-info">
          <h3>CIRCULAR {numero}</h3>
          <h6>{fecha}</h6>
        </div>
      </div>
      <p className="circular-description">{descripcion}</p>
      <div className="btn-download">
        <a href={enlace} target="_blank" rel="noopener noreferrer" download={`Circular_${numero}.pdf`} className="btn dark-btn">
          <span className="material-symbols-outlined icon-circular">cloud_done</span>
          <span className="btn-text">Descargar</span>
        </a>
      </div>
    </div>
  );
};

export default CircularCard;


