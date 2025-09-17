import { useEffect } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import { circularesData } from "../data/CircularesData";
import CircularCard from "../components/ui/CircularesCard";
import "./CircularesDetalles.css"

const CircularesDetalles = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="circulares-container">
      <Navbar />
      <div className="circular-grid">
       {circularesData.map((circular, index) => (
          <CircularCard
            key={index}
            numero={circular.numero}
            fecha={circular.fecha}
            descripcion={circular.descripcion}
            enlace={circular.enlace}
          />
        ))}
      </div>
    </div>
  );
};

export default CircularesDetalles;
