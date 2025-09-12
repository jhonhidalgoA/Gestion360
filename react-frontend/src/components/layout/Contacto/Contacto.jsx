import "./Contacto.css";
import msg_icon from "../../icons/msg-icon.png";
import mail_icon from "../../icons/mail-icon.png";
import phone_icon from "../../icons/phone-icon.png";
import location_icon from "../../icons/location-icon.png";
import white_arrow from "../../icons/white-arrow.png";

const Contacto = () => {
  return (
    <>
      <div className="contact">
        <div className="contact-col">
          <h3>
            Envíanos tu mensaje <img src={msg_icon} alt="" />
          </h3>
          <p>
            Estamos comprometidos con brindar una atención oportuna y de
            calidad. Si deseas obtener información, resolver inquietudes o
            conocer más sobre nuestra institución, completa el siguiente
            formulario y nos pondremos en contacto contigo.
          </p>
          <ul>
            <li>
              <img src={mail_icon} alt="" />
              contact@zirel.com
            </li>
            <li>
              {" "}
              <img src={phone_icon} alt="" /> +57 312-810-3686
            </li>
            <li>
              {" "}
              <img src={location_icon} alt="" />
              1934 Roscoe Street, Chicago <br /> IL 3166, United States{" "}
            </li>
          </ul>
        </div>
        <div className="contact-col">
          <form action="">
            <label htmlFor="">Tu Nombree</label>
            <input
              type="text"
              name="name"
              placeholder="Escribe tu nombre"
              required
            />
            <label htmlFor="">Teléfono</label>
            <input
              type="tel"
              name="phone"
              placeholder="Escribe tu número de teléfono"
              required
            />
            <label htmlFor="">Escribre tu mensaje</label>
            <textarea
              name="message"
              rows="6"
              placeholder="Escribre tu mensaje"
              required
            ></textarea>
            <button type="submit" className="btn dark-btn">
              Enviar mensaje
              <img src={white_arrow} alt="" />
            </button>
          </form>
        </div>
      </div>
      <div className="footer">
        <p>Diseñado por:Zirel</p>        
        <ul>
          <li>Gestion 360</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </>
  );
};

export default Contacto;
