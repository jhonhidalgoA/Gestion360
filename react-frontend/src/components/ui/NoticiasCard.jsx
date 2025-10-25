import "./NoticiasCard.css";
import { useState } from "react";
import PhotoCarousel from "../ui/Slider";

const Card = ({
  image,
  school,
  title,
  date,  
  buttonText = "Saber más",
  buttonLink = "#",
  showDetailsButton = true,
  photos = [],
  photoIndex = 0,
}) => {
  const [showCarousel, setShowCarousel] = useState(false);

  const handleOpenCarousel = (e) => {
    e.preventDefault();    
    setShowCarousel(true);
    
  };

   console.log("🎬 Card renderizada - showCarousel:", showCarousel);

  return (
    <>
      <div className="card-notices">
        <img src={image} alt={title} className="card-img" />
        <div className="card-content">
          <h4>
            {school} <span className="card-span">STEAM 360</span>
          </h4>
          <hr className="custom-hr" />         
          
          <h4>{title}</h4>
          <div className="class-button">
            <span className="date">{date}</span>
            {showDetailsButton && (
              <a
                href={buttonLink}
                onClick={handleOpenCarousel}
                className="btn-card"
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
      {showCarousel && (
        <PhotoCarousel
          photos={photos}
          initialIndex={photoIndex}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
};

export default Card;
