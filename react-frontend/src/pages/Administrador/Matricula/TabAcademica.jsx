import React from "react";

const TabAcademica = ({ formData, handleChange }) => {
  return (
    <div className="tab-content">
      <h3>Información Académica</h3>
      <div className="form-grid">
        <label>
          Dirección de Residencia:
          <input
            type="text"
            name="direccionResidencia"
            value={formData.direccionResidencia}
            onChange={handleChange}
          />
        </label>
        <label>
          Barrio:
          <input
            type="text"
            name="barrio"
            value={formData.barrio}
            onChange={handleChange}
          />
        </label>
        <label>
          Localidad:
          <input
            type="text"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
          />
        </label>
        <label>
          Estrato:
          <select
            name="estrato"
            value={formData.estrato}
            onChange={handleChange}
          >
            <option value="">Seleccionar</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <label>
          Zona:
          <select
            name="zona"
            value={formData.zona}
            onChange={handleChange}
          >
            <option value="urbana">Urbana</option>
            <option value="rural">Rural</option>
          </select>
        </label>
        <label>
          Grupo Sanguíneo:
          <select
            name="grupoSanguineo"
            value={formData.grupoSanguineo}
            onChange={handleChange}
          >
            <option value="">Seleccionar</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>
        <label>
          EPS:
          <input
            type="text"
            name="eps"
            value={formData.eps}
            onChange={handleChange}
          />
        </label>
        <label>
          ¿Presenta discapacidad física?
          <div>
            <input
              type="radio"
              name="discapacidad"
              value="si"
              checked={formData.discapacidad === "si"}
              onChange={handleChange}
            />
            Sí
            <input
              type="radio"
              name="discapacidad"
              value="no"
              checked={formData.discapacidad === "no"}
              onChange={handleChange}
            />
            No
            <input
              type="text"
              placeholder="¿Cuál?"
              name="discapacidadDetalle"
              value={formData.discapacidadDetalle}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          ¿Toma medicamentos?
          <div>
            <input
              type="radio"
              name="medicamentos"
              value="si"
              checked={formData.medicamentos === "si"}
              onChange={handleChange}
            />
            Sí
            <input
              type="radio"
              name="medicamentos"
              value="no"
              checked={formData.medicamentos === "no"}
              onChange={handleChange}
            />
            No
            <input
              type="text"
              placeholder="¿Cuál?"
              name="medicamentosDetalle"
              value={formData.medicamentosDetalle}
              onChange={handleChange}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default TabAcademica;
