import "./Nosotros.css"
import about_img from "../../../assets/images/about.png"
import play_icon from "../../icons/play-icon.png"

function Nosotros({setPlayState}) {
  return (
    <div className="about">
      <div className="about-left">
        <img src={about_img} alt="" className="about-img" />
        <img src={play_icon} alt="" className="play-icon" onClick={()=>{setPlayState(true)}} />
      </div>
      <div className="about-right">
        <h3>Nuestra Institución</h3>
        <h2>
          Los lideres del mañana, hoy soy formados en valores, conocimiento e
          innovación.{" "}
        </h2>
        <p>
          Promovemos el aprendizaje basado en proyectos STEAM (Ciencia,
          Tecnología, Ingeniería, Arte y Matemáticas), fomentando la
          creatividad, el pensamiento crítico y el trabajo en equipo. Creemos
          firmemente que cada estudiante es protagonista de su proceso formativo
          y agente de cambio en la sociedad, preparado para enfrentar los retos
          del presente y construir un futuro sostenible. Nuestra propuesta
          educativa busca trascender las aulas tradicionales, integrando la
          innovación tecnológica, la investigación y la interdisciplinariedad
          como pilares fundamentales. De esta manera, cultivamos competencias
          que permiten a nuestros estudiantes desenvolverse en un mundo
          globalizado, diverso y en constante transformación. Formamos
          ciudadanos íntegros, con valores éticos, responsabilidad social y
          compromiso ambiental, que además de sobresalir académicamente,
          desarrollan habilidades socioemocionales esenciales para la vida.
          Aspiramos a que cada uno de ellos no solo alcance su máximo potencial,
          sino que también se convierta en líder, creador de oportunidades y
          motor de cambio positivo para su comunidad y para el mundo.
        </p>
      </div>
    </div>
  );
}

export default Nosotros;
