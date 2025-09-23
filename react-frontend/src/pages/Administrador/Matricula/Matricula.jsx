import { useState } from "react";
import { useForm } from "react-hook-form";
import TabEstudiante from "./TabEstudiante";
import TabAcademica from "./TabGeneral";
import TabFamiliar from "./TabFamiliar";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";
import "./Matricula.css";

const Matricula = () => {
  const [activeTab, setActiveTab] = useState("estudiante");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
      studentGrade: "",
      studentGroup: "",      
      studentShift: "",
      studentRegister: "",
     

      // Datos Generales
      studentBlood: "",
      studentEPS: "",
      studentEthnic: "",
      studentReference: "",
      studentAddress: "",
      studentNeiborhood: "",
      studentLocality: "",
      studentStatus: "",
      studentZone: "",   
     
      // Datos Familiares - Madre
      motherName: "",
      motherLastname: "",
      motherTypeDocument: "",
      motherDocument: "",
      motherPhone: "",
      motherEmail: "",
      motherProfesion: "",
      motherOcupation: "",

      // Datos Familiares - Padre
      fatherName: "",
      fatherLastname: "",
      fatherTypeDocument: "",
      fatherDocument: "",
      fatherPhone: "",
      fatherEmail: "",
      fatherProfesion: "",
      fatherOcupation: "",
    },
  });

  const handleTabChange = async (tab) => {
    let fieldsToValidate = [];
    let hasErrors = false;

    // Validación por pestaña
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
        "studentGrade",
        "studentGroup",
        "studentBlood",
        "studentShift",
        "studentEthnic",
        "studentReference",
        "studentRegister"
      ];

      const formData = getValues();
      if (!formData.studentPhoto) {
        hasErrors = true;
      }
    } else if (activeTab === "academica") { 
      fieldsToValidate = [
        "studentBlood",
        "studentEPS",
        "studentEthnic",
        "studentReference",
        "studentAddress",
        "studentNeiborhood", 
        "studentLocality",
        "studentStatus",
        "studentZone"
      ];
    } else if (activeTab === "familia") {
      fieldsToValidate = [
        "motherName",
        "motherLastname",
        "motherTypeDocument",
        "motherDocument",
        "motherPhone",
        "motherEmail",
        "motherProfesion",
        "motherOcupation",
        "fatherName",
        "fatherLastname",
        "fatherTypeDocument",
        "fatherDocument",
        "fatherPhone",
        "fatherEmail",
        "fatherProfesion",
        "fatherOcupation",
      ];
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
        const element =
          document.getElementById(firstErrorField) ||
          document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(".photo-label");

        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  const onSubmit = (data) => {
    console.log("🚀 Formulario ENVIADO - Datos completos:", data);
    console.table(data);

    if (!data.studentPhoto) {
      setIsPhotoModalOpen(true);
      return;
    }

    // Aquí puedes preparar los datos para enviar a la base de datos
    const formattedData = {
      // Información básica
      registerDate: data.registerDate,
      codigo: data.codigo,
      
      // Datos del estudiante
      student: {
        photo: data.studentPhoto,
        name: data.name,
        lastname: data.lastname,
        birthDate: data.studentBirthDate,
        age: data.studentAge,
        gender: data.studentGender,
        birthPlace: data.studentBirthPlace,
        documentType: data.studentDocument,
        documentNumber: data.studentDocumentNumber,
        phone: data.studentphone,
        email: data.studentEmail,
        eps: data.studentEPS,
        grade: data.studentGrade,
        group: data.studentGroup,
        bloodType: data.studentBlood,
        shift: data.studentShift,
        ethnicGroup: data.studentEthnic,
        reference: data.studentReference,
      },

      // Datos generales/académicos
      academic: {
        address: data.studentAddress,
        neighborhood: data.studentNeiborhood,
        locality: data.studentLocality,
        status: data.studentStatus,
        zone: data.studentZone,
      },

      // Datos familiares
      family: {
        mother: {
          name: data.motherName,
          lastname: data.motherLastname,
          documentType: data.motherTypeDocument,
          document: data.motherDocument,
          phone: data.motherPhone,
          email: data.motherEmail,
          profession: data.motherProfesion,
          occupation: data.motherOcupation,
        },
        father: {
          name: data.fatherName,
          lastname: data.fatherLastname,
          documentType: data.fatherTypeDocument,
          document: data.fatherDocument,
          phone: data.fatherPhone,
          email: data.fatherEmail,
          profession: data.fatherProfesion,
          occupation: data.fatherOcupation,
        },
      },
    };

    console.log("📤 Datos formateados para BD:", formattedData);
    
    // Aquí harías la llamada a tu API/base de datos
    // await submitToDatabase(formattedData);
    
    setIsSuccessModalOpen(true);
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
          Información General
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
            getValues={getValues}
            trigger={trigger}
          />
        )}
        {activeTab === "academica" && (
          <TabAcademica register={register} errors={errors} />
        )}
        {activeTab === "familia" && (
          <TabFamiliar register={register} errors={errors} />
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

      <Modal
        isOpen={isPhotoModalOpen}
        onClose={handleClosePhotoModal}
        title={
          <>
            Colegio <span className="modal-title-360"> STEAM 360</span>
          </>
        }
        message="Por favor, suba una foto del estudiante."
        buttons={[
          {
            text: "Entendido",
            variant: "danger",
            onClick: handleClosePhotoModal,
          },
        ]}
      />

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title={
          <>
            Colegio <span className="modal-title-360"> STEAM 360</span>
          </>
        }
        message="¡Matrícula registrada con éxito!"
        buttons={[
          {
            text: "Aceptar",
            variant: "success",
            onClick: handleSuccessModalClose,
          },
        ]}
      />
    </div>
  );
};

export default Matricula;