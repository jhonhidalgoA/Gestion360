import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
    <div className="container-login">
      <form action="" className="form-login">
        <div className="title-login">
          <h2>Bienvenido(a) a Gestion 360</h2>
        </div>
        <div className="input-group">
            <label htmlFor="username">Documento:</label>
            <div className="input-wrapper">
            <i class="material-symbols-outlined icon-left" aria-label="person">person</i>
            <input type="text" name="username" id="username" autoComplete="off" required />
            </div>
        </div>
        <div className="input-group">
            <label for="password">Contraseña:</label>
            <div className="input-wrapper">
                <i class="material-symbols-outlined icon-left" aria-label="Lock open">lock_open</i>
                <input type="password" name="password" id="password" autoComplete="off" required />
                <i class="material-symbols-outlined icon-right" aria-label="visibility"
                    id="togglePassword">visibility_off</i>
            </div>
        </div>
        <div className="input-check">
            <div className="check">
                <input type="checkbox" name="checkbox" id="checkbox" placeholder="Recordar"/>
                <p>Recordar</p>
            </div>
            <div className="forgot-password">
             <Link to="/reset" className="forgot-password">
               ¿Olvidó la contraseña?
             </Link>
            </div>
        </div>
        <div className="input-btn">
            <button type="submit" aria-label="ingresar">Ingresar</button>
        </div>
        <div className="social-photo">
            <p class="author">Image by <a
                href="https://pixabay.com/users/vimbroisi-16343850/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5541099">Vinicius
                Imbroisi</a> from <a
                href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5541099">Pixabay</a>
        </p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
