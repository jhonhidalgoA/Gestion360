import { Link } from "react-router-dom";
import { newsData } from "../../../data/newsData";
import Card from "../../ui/Card";
import "./Noticias.css";
import white_arrow from "../../icons/white-arrow.png";

const Noticias = () => {
  return (
    <section className="news-section">
      <div className="card-container">
        {newsData.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            school={item.school}
            title={item.title}
            date={item.date}
            buttonText={item.buttonText}
            buttonLink={item.buttonLink}
          />
        ))}
      </div>
      <div className="button">
        <Link to="/noticia-detalle" className="btn dark-btn">
          Ver más <img src={white_arrow} alt="" />
        </Link>
      </div>
    </section>
  );
};

export default Noticias;
