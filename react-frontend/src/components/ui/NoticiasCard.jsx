import "./NoticiasCard.css"

const Card = ({image, school, title, date, buttonText= "Saber más", buttonLink ="#"}) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <div className="card-content">
        <h4>{school} <span className="card-span">STEAM 360</span></h4>
        <hr className="custom-hr" />
        <h2>{title}</h2>
        <div className="class-button">
            <span className="date">{date}</span>
            <a href={buttonLink} className="btn-card">{buttonText}</a>           
        </div>
      </div>
    </div>
  );
}

export default Card
