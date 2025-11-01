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
              contacto@zirel.com
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
            <label htmlFor="">Tu Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="ej: Juan P"
              required
            />
            <label htmlFor="">Teléfono</label>
             <input
              type="text"
              name="phone"
              placeholder="ej: 310 XXX XXX" 
              required
            />
            <label htmlFor="">Escribe tu mensaje</label>
            <textarea
              name="message"
              rows="6"
              placeholder="Escribe tu mensaje"
              required
            ></textarea>
            <button type="submit" className="btns dark-btn">
              Enviar mensaje
              <img src={white_arrow} alt="" />
            </button>
          </form>
        </div>
      </div>
      
    </>
  );
};

export default Contacto;
