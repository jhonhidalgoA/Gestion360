import { useState } from "react";
import { useForm } from "react-hook-form";
import TabEstudiante from "./TabEstudiante";
import TabAcademica from "./TabAcademica";
import TabFamilia from "./TabFamilia";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal"; 
import "./Matricula.css";

const Matricula = () => {
  const [activeTab, setActiveTab] = useState("estudiante");
  const [isModalOpen, setIsModalOpen] = useState(false);
  

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
    setValue,
    getValues,   
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
      studentAge: "", 
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

      // Datos Académicos 
      grado: "",
      jornada: "",
      fechaIngreso: "",
      observaciones: "",

      // Datos Familiares 
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
    let hasErrors = false;

    if (activeTab === "estudiante") {
      fieldsToValidate = [
        "name",
        "lastname",
        "studentBirthDate",
        "studentGender",
        "studentBirthPlace",
        "studentDocument",
        "studentDocumentNumber",
        "studentphone",
        "studentEmail",
        "studentEPS",
        "studentGrade",
        "studentGroup",
        "studentBlood",
      ];
      
      
      const formData = getValues();
      if (!formData.studentPhoto) {
        hasErrors = true;
      }
    } else if (activeTab === "academica") {
      fieldsToValidate = ["grado", "jornada", "fechaIngreso"];
    } else if (activeTab === "familia") {
      fieldsToValidate = ["nombrePadre", "telefonoPadre", "nombreMadre", "telefonoMadre"];
    }

    if (fieldsToValidate.length > 0) {
      const isValidTab = await trigger(fieldsToValidate);
      if (!isValidTab || hasErrors) {        
        setIsModalOpen(true);
        return;
      }
    }

    setActiveTab(tab);
  };

  const handleConfirmModal = () => {
    setIsModalOpen(false);
       
    const firstErrorField = Object.keys(errors)[0]; 
    if (firstErrorField) {
     
      setTimeout(() => {
        const element = document.getElementById(firstErrorField) || 
                      document.querySelector(`[name="${firstErrorField}"]`) ||
                      document.querySelector('.photo-label'); 
        
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    console.log("Formulario válido. Datos:", data);
    
    // Validación adicional antes del envío
    if (!data.studentPhoto) {
      alert("Por favor, suba una foto del estudiante.");
      return;
    }
    
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
          <TabEstudiante 
            register={register} 
            errors={errors} 
            setValue={setValue}
            trigger={trigger}
          />
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
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          <>
            Colegio <span className="modal-title-360"> STEAM 360</span>
          </>
        }
        message="Por favor completar todos los campos requeridos antes de cambiar de pestaña."
        buttons={[
          {
            text: "Entendido",
            variant: "success",            
            onClick: handleConfirmModal,
          },
        ]}
      />
    </div>
  );
};

export default Matricula;