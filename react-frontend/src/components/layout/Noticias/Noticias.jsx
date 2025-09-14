import { Link } from "react-router-dom";
import { newsData } from "../../../data/NoticiasData";
import Card from "../../ui/NoticiasCard";
import "./Noticias.css";
import white_arrow from "../../icons/white-arrow.png";

const Noticias = ({ cardsToShow = 3, showDetailsButton = false }) => {
  const displayedCards = newsData.slice(0, cardsToShow);

  return (
    <section className="news-section">
      <div className="card-container">
        {displayedCards.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            school={item.school}
            title={item.title}
            date={item.date}
            buttonText={item.buttonText}
            buttonLink={item.buttonLink}
            showDetailsButton={showDetailsButton}
          />
        ))}
      </div>
      <div className="button">
        <Link to="/noticia-detalle" className="btn dark-btn">
          Ver más <img src={white_arrow} alt="image" />
        </Link>
      </div>
    </section>
  );
};

export default Noticias;
