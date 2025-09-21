import { useState } from "react";
import { useForm } from "react-hook-form";
import TabEstudiante from "./TabEstudiante";
import TabAcademica from "./TabAcademica";
import TabFamilia from "./TabFamilia";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import "./Matricula.css";

const Matricula = () => {
  const [activeTab, setActiveTab] = useState("estudiante");

  const generateStudentCode = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); 
    return `MAT-${year}-${random}`;
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,    
  } = useForm({
    mode: "onBlur",
    defaultValues: {

      // Datos Estudiante
      registerDate: todayDate,
      codigo: generateStudentCode(),
      studentPhoto: null,
      name: "",
      lastname: "",
      studentBirthDate: "",
      studentGender: "",
      studentBirthPlace: "",
      studentDocument: "",
      studentDocumentNumber: "",
      studentphone: "",
      studentEmail: "",
      studentEPS: "",
      studentGrade: "",
      studentGroup: "",
      studentBlood: "",

      // Datos Académicos (para completar luego)
      grado: "",
      jornada: "",
      fechaIngreso: "",
      observaciones: "",

      // Datos Familiares (para completar luego)
      nombrePadre: "",
      telefonoPadre: "",
      emailPadre: "",
      nombreMadre: "",
      telefonoMadre: "",
      emailMadre: "",
      acudiente: "",
      telefonoAcudiente: "",
      emailAcudiente: "",
    },
  });

  const handleTabChange = async (tab) => {
    let fieldsToValidate = [];

    if (activeTab === "estudiante") {
      fieldsToValidate = [
        "name",
        "lastname",
        "studentBirthDate",
        "studentGender",
        "studentDocument",
        "studentDocumentNumber",
        "studentphone",
        "studentEmail",
        "studentEPS",
        "studentGrade",
        "studentGroup",
        "studentBlood",
      ];
    }

    
    if (fieldsToValidate.length > 0) {
      const isValidTab = await trigger(fieldsToValidate);
      if (!isValidTab) {
        alert(
          "Por favor completa los campos obligatorios antes de cambiar de pestaña."
        );
        return;
      }
    }

    setActiveTab(tab);
  };

  const onSubmit = (data) => {
    console.log("Formulario válido. Datos:", data);
    // Aquí envías al backend
    alert("¡Matrícula registrada con éxito!");
  };

  return (
    <div className="student-registration">
      <NavbarSection title="Registro Matrícula Estudiante" color="#2e86c1" />

      <div className="tabs">
        <button
          className={activeTab === "estudiante" ? "active" : ""}
          onClick={() => handleTabChange("estudiante")}
        >
          Datos Estudiante
        </button>
        <button
          className={activeTab === "academica" ? "active" : ""}
          onClick={() => handleTabChange("academica")}
        >
          Información Académica
        </button>
        <button
          className={activeTab === "familia" ? "active" : ""}
          onClick={() => handleTabChange("familia")}
        >
          Datos Familiares
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="formStudent">
        {activeTab === "estudiante" && (
          <TabEstudiante register={register} errors={errors} />
        )}
        {activeTab === "academica" && (
          <TabAcademica register={register} errors={errors} />
        )}
        {activeTab === "familia" && (
          <TabFamilia register={register} errors={errors} />
        )}

        <div className="form-actions">
          <Botones
            onSave={handleSubmit(onSubmit)}
            onEdit={() => alert("Editar")}
            onDelete={() => alert("Eliminar")}
            onGeneratePDF={() => alert("Generar PDF")}
            disabled={!isValid}
          />
        </div>
      </form>
    </div>
  );
};

export default Matricula;
