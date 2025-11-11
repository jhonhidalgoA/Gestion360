import { useEffect } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import Noticias from "../components/layout/Noticias/Noticias";
import "./NoticiasDetalles.css";

const NoticiasDetalle = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="news-school">
      <Navbar />
      <div className="header">
        <h1>Noticias</h1>
        <p>Noticias y actividades de nuestra Comunidad Educativa</p>
      </div>
      <Noticias cardsToShow={6} showDetailsButton={true} showMoreButton={false} />
    </div>
  );
};

export default NoticiasDetalle;