import React, { useState } from "react";
import TabEstudiante from "./TabEstudiante";
import TabAcademica from "./TabAcademica";
import TabFamilia from "./TabFamilia";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import "./Matricula.css";

const Matricula = () => {
  const [activeTab, setActiveTab] = useState("estudiante");
  const [formData, setFormData] = useState({
    // Datos estudiante
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
    email: "",

    // Información académica
    grado: "",
    jornada: "",
    fechaIngreso: "",
    observaciones: "",

    // Datos familiares
    nombrePadre: "",
    telefonoPadre: "",
    emailPadre: "",
    nombreMadre: "",
    telefonoMadre: "",
    emailMadre: "",
    acudiente: "",
    telefonoAcudiente: "",
    emailAcudiente: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos a guardar:", formData);
    // Aquí mandas a tu backend con fetch o axios
  };

  return (
    <div className="student-registration">
      <NavbarSection title="Registro Matrícula Estudiante" color="#2e86c1" />
            
      <div className="tabs">
        <button
          className={activeTab === "estudiante" ? "active" : ""}
          onClick={() => setActiveTab("estudiante")}
        >
          Datos Estudiante
        </button>
        <button
          className={activeTab === "academica" ? "active" : ""}
          onClick={() => setActiveTab("academica")}
        >
         Información Académica
        </button>
        <button
          className={activeTab === "familia" ? "active" : ""}
          onClick={() => setActiveTab("familia")}
        >
          Datos Familiares
        </button>
      </div>

      <form onSubmit={handleSubmit} className="formStudent">
        {activeTab === "estudiante" && (
          <TabEstudiante formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "academica" && (
          <TabAcademica formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "familia" && (
          <TabFamilia formData={formData} handleChange={handleChange} />
        )}

        <div className="actions">
          <button type="button" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-secondary">Editar</button>
          <button type="button" className="btn btn-danger">Eliminar</button>
          <button type="button" className="btn btn-info">Generar PDF</button>
        </div>
      </form>
    </div>
  );
};

export default Matricula;
