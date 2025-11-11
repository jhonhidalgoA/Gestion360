import "./ResetEmail.css"


const Reset = () => {
  return (
    <div className="reset-password">
      <div className="container-reset">
      <form action="" className="form-reset">
        <div className="title-reset">
            <h1>¿No recuerdas tú contraseña?</h1>
            <h4>¡No te preocupes! <span> Nos sucede a todos.</span> Ingresa tú Email y te ayudaremos </h4>
        </div>
        <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
                <i class="material-symbols-outlined icon-left" aria-label="Icono de usuario">mail</i>
                <input type="text" name="email" id="email" />
            </div>
            <div className="input-btn">
                <button type="submit" class="btn">Restablecer contraseña</button>
            </div>
        </div>
        <div className="social-photo">
            <p className="author">Image by: Vinicius Imbroisi <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5541099">Pixabay</a></p>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Reset;
