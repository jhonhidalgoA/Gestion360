import "./TabEstudiante.css";

const TabEstudiante = ({ formData, handleChange }) => {
  return (
    <div className="tab-content">
      <div className="photo-container">
        <label htmlFor="photo" className="photo-label">
          <span>Foto del Estudiante</span>
          <input type="file" id="photo" name="student_photo" accept="image/*" />
          <div className="photo-preview"></div>
        </label>
      </div>
      <div className="register-fields">
        <h3>Datos del estudiante</h3>
        <div className="field-row">
          <div className="group">
            <label htmlFor="register-date">Fecha de Matrícula:</label>
            <input
              type="date"
              name="register-date"
              id="register-date"
              readOnly
            />
          </div>
          <div className="group">
            <label htmlFor="codigo">Código</label>
            <input type="number" name="codigo" id="codigo" />
          </div>
          <div className="group">
            <label htmlFor="name">Nombres:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="group">
            <label htmlFor="lastname">Apellidos:</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="group">
            <label htmlFor="studentBirthDate">Fecha de Nacimiento:</label>
            <input
              type="date"
              name="studentBirthDate"
              id="studentBirthDate"
              value={formData.studentBirthDate}
            />
          </div>
          <div className="group">
            <label htmlFor="studentAge">Edad:</label>
            <input type="number" name="studentAge" id="studentAge" />
          </div>
          <div className="group">
            <label htmlFor="studentGender">Género</label>
            <select
              name="studentGender"
              id="studentGender"
              value={formData.studentGender}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="binario">No Binario</option>
            </select>
          </div>
          <div className="group">
            <label htmlFor="studentBirthPlace">Lugar de Nacimiento:</label>
            <input
              type="text"
              name="studentBirthPlace"
              id="studentBirthPlace"
              value={formData.studentBirthPlace}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="group">
            <label htmlFor="studentDocument">Tipo de Documento:</label>
            <select
              id="studentDocument"
              name="studentDocument"
              value={formData.studentDocument}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="RC">Registro Civil (RC)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
            </select>
          </div>
          <div className="group">
            <label htmlFor="studentDocumentNumber">Número de Documento:</label>
            <input
              type="number"
              name="studentDocumentNumber"
              id="studentDocumentNumber"
              value={formData.studentDocumentNumber}
              onChange={handleChange}
            />
          </div>    
          <div className="group">
            <label htmlFor="studentphone">Teléfono:</label>
            <input
              type="number"
              name="studentphone"
              id="studentphone"
              value={formData.studentphone}
              onChange={handleChange}
            />
          </div>     
          <div className="group">
            <label htmlFor="studentEmail">Correo Electrónico:</label>
            <input
              type="text"
              name="studentEmail"
              id="studentEmail"
              placeholder="ejemplo@dominio.com"
              value={formData.studentEmail}
              onChange={handleChange}
            />
          </div>        
        </div>
          <div className="field-row">
            <div className="group">
              <label htmlFor="studendBlood">Grupo Sanguíneo:</label>
              <select name="studentBlood" id="studentBlood" value={formData.studentBlood}
              onChange={handleChange}>
                 <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
              </select>
            </div>
            <div className="group">
              <label htmlFor="studentEPS">EPS:</label>
              <input type="text" name="studentEPS" id="studentEPS" value={formData.studentEPS}
              onChange={handleChange} />
            </div>
            <div className="group">
              
            </div>
          </div>
      </div>
    </div>
  );
};

export default TabEstudiante;
