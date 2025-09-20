import React from "react";

const TabFamilia = ({ formData, handleChange }) => {
  return (
    <div className="tab-content">
      <h2>Datos Familiares</h2>
      
      <h3>Padre</h3>
      <label>Nombre</label>
      <input type="text" name="nombrePadre" value={formData.nombrePadre} onChange={handleChange} />

      <label>Teléfono</label>
      <input type="text" name="telefonoPadre" value={formData.telefonoPadre} onChange={handleChange} />

      <label>Email</label>
      <input type="email" name="emailPadre" value={formData.emailPadre} onChange={handleChange} />

      <h3>Madre</h3>
      <label>Nombre</label>
      <input type="text" name="nombreMadre" value={formData.nombreMadre} onChange={handleChange} />

      <label>Teléfono</label>
      <input type="text" name="telefonoMadre" value={formData.telefonoMadre} onChange={handleChange} />

      <label>Email</label>
      <input type="email" name="emailMadre" value={formData.emailMadre} onChange={handleChange} />

      <h3>Acudiente</h3>
      <label>Nombre</label>
      <input type="text" name="acudiente" value={formData.acudiente} onChange={handleChange} />

      <label>Teléfono</label>
      <input type="text" name="telefonoAcudiente" value={formData.telefonoAcudiente} onChange={handleChange} />

      <label>Email</label>
      <input type="email" name="emailAcudiente" value={formData.emailAcudiente} onChange={handleChange} />
    </div>
  );
};

export default TabFamilia;
