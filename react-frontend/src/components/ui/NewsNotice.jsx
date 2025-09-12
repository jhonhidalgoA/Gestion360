import "./NewsNotice.css";

const NewsNotice = ({ title, date, image, school, onOpenModal }) => {
  return (
    <div className="news-card">
      <img src={image} alt={title} />
      <div className="card-content">
        <div className="card-category">{school}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-date">{date}</p>
        <button className="card-button" onClick={onOpenModal}>
          Saber más
        </button>
      </div>
    </div>
  );
};

export default NewsNotice;