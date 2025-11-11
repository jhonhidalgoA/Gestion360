// src/components/pages/HomePage.jsx
import React from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/layout/Hero/Hero";
import Noticias from "../components/layout/Noticias/Noticias";
import Title from "../components/layout/Titulo/Titulo";
import Eventos from "../components/layout/Eventos/Eventos";
import Nosotros from "../components/layout/Nosotros/Nosotros";
import Institucional from "../components/layout/Institucional/Institucional";
import Contacto from "../components/layout/Contacto/Contacto";
import Footer from "../components/layout/Footer/Footer";
import VideoPlayer from "../components/layout/VideoPlayer/VideoPlayer";

const HomePage = ({ playState, setPlayState }) => {
  return (
    <>
      <Navbar />
      <div id="inicio">
        <Hero />
      </div>
      <div className="container">
        <div id="noticias">
          <Title subTitle="Noticias" title="Lo más Reciente" />
          <Noticias />
        </div>
        <div id="eventos">
          <Title subTitle="Eventos" title="Agenda Escolar" />
          <Eventos />
        </div>
        <div id="nosotros">
          <Title subTitle="Nosotros" title="Nuestro Proposito" />
          <Nosotros setPlayState={setPlayState} />
        </div>
        <div id="institucional">
          <Title subTitle="Institucional" title="Servicios y Comunidad" />
          <Institucional />
        </div>
        <div id="contacto">
          <Title subTitle="Contacto" title="Estamos aquí para ayudarte" />
          <Contacto />
        </div>
        <div id="footer">          
          <Footer />
        </div>
      </div>
      <VideoPlayer playState={playState} setPlayState={setPlayState} />
    </>
  );
};

export default HomePage;