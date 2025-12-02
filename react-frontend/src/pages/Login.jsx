import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username, password);

    if (result.success) {
      navigate(result.redirect);
    } else {
      setError("Documento o Contraseña incorrectos");
    }
  };

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="container-login">
        <form onSubmit={handleSubmit} className="form-login">
          <div className="title-login">
            <h2>Bienvenido(a) a Gestion 360</h2>
          </div>
          <div className="error-login">
            {error && <div className="error-message-login">{error}</div>}
          </div>
          <div className="input-group">
            <label htmlFor="username">Documento:</label>
            <div className="input-wrapper">
              <i
                className="material-symbols-outlined icon-left"
                aria-label="person"
              >
                person
              </i>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="off"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="input-wrapper">
              <i
                className="material-symbols-outlined icon-left"
                aria-label="Lock open"
              >
                lock_open
              </i>
              <input
                type={showPassword ? "text" : "password"} // Cambia dinámicamente
                name="password"
                id="password"
                autoComplete="off"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <i
                className="material-symbols-outlined icon-right"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={togglePasswordVisibility} // Agregar onClick
                style={{ cursor: "pointer" }} // Asegurar que muestre cursor pointer
              >
                {showPassword ? "visibility" : "visibility_off"} {/* Cambiar ícono dinámicamente */}
              </i>
            </div>
          </div>
          <div className="input-check">
            <div className="check">
              <input
                type="checkbox"
                name="checkbox"
                id="checkbox"
                placeholder="Recordar"
              />
              <p>Recordar</p>
            </div>
            <div className="forgot-password">
              <Link to="/reset" className="forgot-password">
                ¿Olvidó la contraseña?
              </Link>
            </div>
          </div>
          <div className="input-btn btn-login">
            <button type="submit" aria-label="ingresar" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
          <div className="social-photo">
            <p className="author">
              Image by{" "}
              <a href="https://pixabay.com/users/vimbroisi-16343850/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5541099">
                Vinicius Imbroisi
              </a>{" "}
              from{" "}
              <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5541099">
                Pixabay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;