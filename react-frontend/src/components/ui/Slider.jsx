import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import './Slider.css';

export default function PhotoCarousel({ photos = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!photos || photos.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="photo-carousel-overlay">
      <button
        onClick={onClose}
        className="photo-carousel-close"
      >
        <FaTimes size={36} />
      </button>

      <div className="photo-carousel-content">
        <div className="photo-carousel-wrapper">
          <div className="photo-carousel-slide">
            <img
              src={photos[currentIndex]?.url || photos[currentIndex]}
              alt={photos[currentIndex]?.title || `Foto ${currentIndex + 1}`}
              className="photo-carousel-image"
            />

            <div className="photo-carousel-gradient" />

            {photos[currentIndex]?.title && (
              <div className="photo-carousel-info">
                <h2 className="photo-carousel-title">{photos[currentIndex].title}</h2>
                {photos[currentIndex].subtitle && (
                  <p className="photo-carousel-subtitle">{photos[currentIndex].subtitle}</p>
                )}
                {photos[currentIndex].comment && (
                  <p className="photo-carousel-comment">{photos[currentIndex].comment}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={prevSlide}
            className="photo-carousel-nav photo-carousel-nav-prev"
          >
            <FaChevronLeft size={32} />
          </button>

          <button
            onClick={nextSlide}
            className="photo-carousel-nav photo-carousel-nav-next"
          >
            <FaChevronRight size={32} />
          </button>

          <div className="photo-carousel-dots">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`photo-carousel-dot ${currentIndex === index ? 'photo-carousel-dot-active' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="photo-carousel-counter">
          <p className="photo-carousel-counter-text">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}