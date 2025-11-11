import { useState, useEffect } from "react";
import "./TabEstudiante.css";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import PhotoUpload from "../../../components/ui/PhotoUpload"; 
import {
  documentOptions,
  genderOptions,
  gradeOptions,
  gradeShift,
  gradeRegister,
} from "../../../constants/formOptions";

const TabEstudiante = ({ register, errors, setValue, watch }) => {
  const [age, setAge] = useState("");

  
  const watchedPhoto = watch("studentPhoto");
  const watchedBirthDate = watch("studentBirthDate");

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "";
    const birthDate = new Date(birthDateString);
    const today = new Date();
    if (birthDate > today) return "";
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge : "";
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    const calculatedAge = calculateAge(value);
    setAge(calculatedAge);
    setValue("studentAge", calculatedAge);
  };

  
  useEffect(() => {
    if (watchedBirthDate) {
      const calculatedAge = calculateAge(watchedBirthDate);
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  }, [watchedBirthDate]);

  
  const handlePhotoChange = (file) => {
    setValue("studentPhoto", file);
  };

  return (
    <div className="tab-content">    
      <PhotoUpload
        id="student-photo"
        label="Foto del Estudiante"
        value={watchedPhoto}
        onChange={handlePhotoChange}
        error={errors.studentPhoto}
        maxSizeMB={5}
        allowedTypes={["image/jpeg", "image/png", "image/webp"]}
      />

      <div className="register-fields">
        <div className="field-row">
          <div className="group">
            <label htmlFor="register-date">Fecha de Matrícula:</label>
            <input
              type="date"
              className="input-autofill"
              id="register-date"
              name="registerDate"
              {...register("registerDate")}
              readOnly
            />
          </div>
          <div className="group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              className="input-autofill"
              id="codigo"
              name="codigo"
              {...register("codigo")}
              readOnly
            />
          </div>
          <div className="group">
            <InputField
              label="Nombres:"
              id="name"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Apellidos:"
              id="lastname"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 20, message: "Máximo 20 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="group">
            <label htmlFor="studentBirthDate">Fecha de Nacimiento</label>
            <input
              type="date"
              id="studentBirthDate"
              name="studentBirthDate"
              {...register("studentBirthDate", {
                required: "La fecha de nacimiento es requerida",
                validate: {
                  notFuture: (value) => {
                    if (!value) return true;
                    const date = new Date(value);
                    const today = new Date();
                    return date <= today || "La fecha no puede ser futura";
                  },
                  validAge: (value) => {
                    if (!value) return true;
                    const age = calculateAge(value);
                    return (
                      (age >= 6 && age <= 99) ||
                      "La edad debe estar entre 6 y 99 años"
                    );
                  },
                },
              })}
              onChange={handleBirthDateChange}
              className={`input-line ${
                errors.studentBirthDate ? "input-error" : ""
              }`}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.studentBirthDate && (
              <span className="error-message">
                {errors.studentBirthDate.message}
              </span>
            )}
          </div>
          <div className="group">
            <label htmlFor="studentAge">Edad:</label>
            <input
              type="number"
              id="studentAge"
              name="studentAge"
              value={age}
              readOnly
              className="input-line"
            />
          </div>
          <SelectField
            label="Género"
            id="studentGender"
            register={register}
            errors={errors}
            required
            options={genderOptions}
          />
          <InputField
            label="Lugar de Nacimiento:"
            id="studentBirthPlace"
            register={register}
            errors={errors}
            required
            validation={{
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            }}
          />
        </div>
        <div className="field-row">
          <div className="group">
            <SelectField
              label="Tipo de Documento:"
              id="studentDocument"
              register={register}
              errors={errors}
              required
              options={documentOptions}
            />
          </div>
          <div className="group">
            <InputField
              label="Número de Documento:"
              id="studentDocumentNumber"
              type="text"
              register={register}
              errors={errors}
              required
              validation={{
                pattern: {
                  value: /^\d{5,15}$/,
                  message: "Debe ser numérico (5-15 dígitos)",
                },
              }}
            />
          </div>
          <InputField
            label="Teléfono:"
            id="studentphone"
            type="text"
            register={register}
            errors={errors}
            required
            validation={{
              pattern: {
                value: /^\d{7,15}$/,
                message: "Teléfono inválido (7-15 dígitos)",
              },
            }}
          />
          <InputField
            label="Correo Electrónico:"
            id="studentEmail"
            type="email"
            register={register}
            errors={errors}
            required
            placeholder="ejemplo@dominio.com"
            validation={{
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Formato de correo inválido",
              },
            }}
          />
        </div>
        <div className="field-row">
          <div className="group">
            <SelectField
              label="Grado al que ingresa"
              id="studentGrade"
              register={register}
              errors={errors}
              required
              options={gradeOptions}
            />
          </div>
          <InputField
            label="Grupo:"
            id="studentGroup"
            register={register}
            errors={errors}
            required
            validation={{
              pattern: {
                value: /^[A-Z]{1}$/,
                message: "Debe ser una letra mayúscula (A, B, C...)",
              },
            }}
          />
          <div className="group">
            <SelectField
              label="Jornada:"
              id="studentShift"
              register={register}
              errors={errors}
              required
              options={gradeShift}
            />
          </div>
          <SelectField
            label="Tipo de Matrícula"
            id="studentRegister"
            register={register}
            errors={errors}
            required
            options={gradeRegister}
          />
        </div>
      </div>
    </div>
  );
};

export default TabEstudiante;