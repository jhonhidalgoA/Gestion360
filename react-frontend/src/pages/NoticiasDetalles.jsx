import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { newsData } from "../data/noticeData";
import Navbar from "../components/layout/Navbar/Navbar";
import NewsNotice from "../components/ui/NewsNotice";
import "./NoticiasDetalles.css";

const NoticiasDetalle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

   const openModal = (news) => {
    setCurrentNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNews(null);
  };

  return (
    <div className="ensayo">
      <Navbar />
      <div className="noticias-detalle-container">
        <div className="header">
          <h1>NOTICIAS</h1>
          <p>Noticias y actividades de nuestra Comunidad Educativa</p>
        </div>

        <div className="news-grid">
          {newsData.map((item) => (
            <div key={item.id} className="news-card-wrapper">
              <NewsNotice 
                title={item.title}
                date={item.date}
                image={item.image}
                school={item.school}
                onOpenModal={() => openModal(item)}
              />
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && currentNews && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>

              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                className="news-swiper"
              >
                {currentNews.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${currentNews.title} - ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-button-prev">‹</div>
              <div className="swiper-button-next">›</div>

              <div className="modal-description">
                <h2>{currentNews.title}</h2>
                <p>{currentNews.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticiasDetalle;
