import { useState } from "react";
import { useForm } from "react-hook-form";
import { getDefaultValues } from "../Matricula/config/defaultValues";
import {
  validateTab,
  formatMatriculaData,
  mapMatriculaToFrontend, // ✅ importado
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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setValue,
    reset,
    watch,
    getValues,
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
      console.error(" Error al enviar a la API:", error);
      setErrorMessage(
        "No se pudo registrar la matrícula. Debe completar todos los campos y/o Verifique el servidor."
      );
      setIsErrorModalOpen(true);
    }
  };

  const handleClear = () => {
    reset(getDefaultValues());
    setActiveTab("estudiante");
  };

  // ✅ CORREGIDO: usa mapMatriculaToFrontend
  const loadStudentForEdit = (matricula) => {
    const values = mapMatriculaToFrontend(matricula);
    values.id_estudiante = matricula.id;
    
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
          onLoadPDF={() => {
            const id = getValues("id_estudiante");
            if (id) {
              window.open(`http://localhost:8000/matricula-pdf/${id}`, '_blank');
            }
          }}
          saveDisabled={!isValid}
          pdfDisabled={!getValues("id_estudiante")}
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

      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title={
          <>
            Colegio <span className="modal-title-360">STEM 360</span>
          </>
        }
        message={errorMessage}
        buttons={[
          {
            text: "Aceptar",
            variant: "danger",
            onClick: () => setIsErrorModalOpen(false),
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
