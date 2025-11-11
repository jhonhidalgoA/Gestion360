import { useState } from "react";
import { useForm } from "react-hook-form";
import { getDefaultValues } from "../Matricula/config/defaultValues";
import {
  validateTab,
  formatMatriculaData,
} from "../Matricula/utils/formHelpers";
import { postMatricula } from "../Matricula/utils/apiHelpers";
import ModalListaEstudiantes from "../Matricula/ModalListaEstudiante";
import TabEstudiante from "./TabEstudiante";
import TabAcademica from "./TabAcademica";
import TabFamiliar from "./TabFamiliar";
import NavbarSection from "../../../components/layout/Navbar/NavbarSection";
import Botones from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";
import "./Matricula.css";
import { FaExclamation } from "react-icons/fa";

const Matricula = () => {
  const [activeTab, setActiveTab] = useState("estudiante");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: getDefaultValues(),
  });

  const handleTabChange = async (tab) => {
    const isValidTab = await validateTab(activeTab, trigger, setIsModalOpen);
    if (isValidTab) setActiveTab(tab);
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = formatMatriculaData(data);
      await postMatricula(formattedData);
      reset(getDefaultValues());
      setActiveTab("estudiante");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("❌ Error al enviar a la API:", error);
      alert("No se pudo registrar la matrícula. Verifique el servidor.");
    }
  };

  // Función para limpiar el formulario
  const handleClear = () => {
    reset(getDefaultValues());
    setActiveTab("estudiante");
  };

  const loadStudentForEdit = (matricula) => {
    const values = {
      // Datos del estudiante (TabEstudiante)
      name: matricula.student.name,
      lastname: matricula.student.lastname,
      studentBirthDate: matricula.student.birthDate,
      studentAge: matricula.student.age,
      studentGender: matricula.student.gender,
      studentBirthPlace: matricula.student.birthPlace,
      studentDocument: matricula.student.documentType,
      studentDocumentNumber: matricula.student.documentNumber,
      studentphone: matricula.student.phone,
      studentEmail: matricula.student.email,
      studentGrade: matricula.student.grade,
      studentGroup: matricula.student.group,
      studentShift: matricula.student.shift,
      studentRegister: matricula.student.registerType || "",

      // Datos de TabAcademica
      studentBlood: matricula.student.bloodType,
      studentEPS: matricula.student.eps,
      studentEthnic: matricula.student.ethnicGroup,
      studentReference: matricula.student.reference,

      // Dirección y ubicación
      studentAddress: matricula.academic.address,
      studentNeighborhood: matricula.academic.neighborhood,
      studentLocality: matricula.academic.locality,
      studentStatus: matricula.academic.status,
      studentZone: matricula.academic.zone,

      // Datos familiares
      motherName: matricula.family.mother.name,
      motherLastname: matricula.family.mother.lastname,
      motherTypeDocument: matricula.family.mother.documentType,
      motherDocument: matricula.family.mother.document,
      motherPhone: matricula.family.mother.phone,
      motherEmail: matricula.family.mother.email,
      motherProfesion: matricula.family.mother.profession,
      motherOcupation: matricula.family.mother.occupation,

      fatherName: matricula.family.father.name,
      fatherLastname: matricula.family.father.lastname,
      fatherTypeDocument: matricula.family.father.documentType,
      fatherDocument: matricula.family.father.document,
      fatherPhone: matricula.family.father.phone,
      fatherEmail: matricula.family.father.email,
      fatherProfesion: matricula.family.father.profession,
      fatherOcupation: matricula.family.father.occupation,
    };

    reset(values);
    setActiveTab("estudiante");
  };

  return (
    <div className="student-registration">
      <NavbarSection title="Registro Matrícula Estudiante" color="#F57C00" />

      <div className="tabs">
        {["estudiante", "academica", "familia"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleTabChange(tab)}
            type="button"
          >
            {tab === "estudiante"
              ? "Datos Estudiante"
              : tab === "academica"
              ? "Información General"
              : "Datos Familiares"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="formStudent">
        {activeTab === "estudiante" && (
          <TabEstudiante
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
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
            onEdit={() => setIsStudentListModalOpen(true)}
            onDelete={handleClear}
            onGeneratePDF={() => alert("Generar PDF")}
            disabled={!isValid}
          />
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message="Por favor completar todos los campos obligatorios antes de continuar."
        buttons={[
          {
            text: "Entendido",
            variant: "success",
             icon: <FaExclamation />,
            onClick: () => setIsModalOpen(false),
          },
        ]}
      />

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message="¡Matrícula registrada con éxito!"
        buttons={[
          {
            text: "Aceptar",
            variant: "success",
            onClick: () => setIsSuccessModalOpen(false),
          },
        ]}
      />

      <ModalListaEstudiantes
        isOpen={isStudentListModalOpen}
        onClose={() => setIsStudentListModalOpen(false)}
        onSelect={loadStudentForEdit}
      />
    </div>
  );
};

export default Matricula;