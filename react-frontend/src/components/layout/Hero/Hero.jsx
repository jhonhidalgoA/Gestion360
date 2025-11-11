import { Link } from "react-router-dom";
import "./Hero.css";
import white_arrow from "../../icons/white-arrow.png";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Matrículas Abiertas 2026 </h1>
        <p>
          Forma parte de nuestra comunidad educativa con enfoque en innovación y
          excelencia académica, un proyecto que transforma vidas y abre
          oportunidades para el futuro.
        </p>
        
      </div>
      <div className="button-hero">
          <Link to="/info-matricula" className="btns dark-btn">
            Más información
            <img src={white_arrow} alt="" className="dark-arrow" />
          </Link>
        </div>
    </div>
  );
};

export default Hero;
