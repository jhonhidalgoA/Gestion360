import { useState, useEffect } from "react";
import "./TabDocenteDatos.css";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import PhotoUpload from "../../../components/ui/PhotoUpload";

const TabDocenteDatos = ({ register, errors, setValue, watch }) => {
  const [age, setAge] = useState("");
  const watchedPhoto = watch("teacherPhoto");
  const watchedBirthDate = watch("teacherBirthDate");

  const genderOptions = [
    { value: "", label: "Seleccionar" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "no-binario", label: "No Binario" },
  ];

  const documentOptions = [
    { value: "", label: "Seleccionar" },
    { value: "RC", label: "Registro Civil (RC)" },
    { value: "TI", label: "Tarjeta de Identidad (TI)" },
    { value: "CC", label: "Cédula de Ciudadanía (CC)" },
    { value: "CE", label: "Cédula de Extranjería (CE)" },
    { value: "PEP", label: "Permiso Especial de Permanencia (PEP)" },
  ];

  const areaOptions = [
    { value: "", label: "Seleccionar" },
    { value: "algebra", label: "Álgebra" },
    { value: "biologia", label: "Biología" },
    { value: "calculo", label: "Cálculo" },
    { value: "ciencias de la tierra", label: "Ciencias de la Tierra" },
    { value: "constitucion politica", label: "Constitución Política" },
    { value: "democracia y paz", label: "Democracia y Paz" },
    { value: "educacion artistica", label: "Educación Artística" },
    { value: "educacion fisica", label: "Educación Física" },
    { value: "español", label: "Español (Gramática, Literatura)" },
    { value: "estadistica", label: "Estadística" },
    { value: "etica y valores humanos", label: "Ética y Valores Humanos" },
    { value: "fisica", label: "Física" },
    { value: "geografia", label: "Geografía" },
    { value: "geometria", label: "Geometría" },
    { value: "historia de colombia", label: "Historia de Colombia" },
    { value: "ingles", label: "Inglés (como lengua extranjera)" },
    { value: "quimica", label: "Química" },
    { value: "tecnologia e informatica", label: "Tecnología e Informática" },
  ];

  const scaleOptions = [
    { value: "", label: "Seleccionar" },
    { value: "1a", label: "1A" },
    { value: "1b", label: "1B" },
    { value: "1c", label: "1C" },
    { value: "1d", label: "1D" },
    { value: "2a", label: "2A" },
    { value: "2b", label: "2B" },
    { value: "2c", label: "2C" },
    { value: "2d", label: "2D" },
    { value: "3a", label: "3A" },
    { value: "3b", label: "3B" },
    { value: "3c", label: "3C" },
    { value: "3d", label: "3D" },
  ];

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
    setValue("teacherAge", calculatedAge);
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
  if (!file) {
    setValue("teacherPhoto", null);
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    setValue("teacherPhoto", reader.result); // ← cadena base64 completa
  };
  reader.readAsDataURL(file);
};

  return (
    <div className="tab-content-teacher">
      <div className="photo-container">
        <PhotoUpload
          id="teacher-photo"
          label="Foto del Docente"
          value={watchedPhoto}
          onChange={handlePhotoChange}
          error={errors.teacherPhoto}
          maxSizeMB={5}
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
        />
      </div>

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
              id="teacherName"
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
              id="teacherLastname"
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
            <label htmlFor="teacherBirthDate">Fecha de Nacimiento</label>
            <input
              type="date"
              id="teacherBirthDate"
              {...register("teacherBirthDate", {
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
            <label htmlFor="teacherAge">Edad:</label>
            <input
              type="text"
              id="teacherAge"
              value={age}
              readOnly
              className="input-line"
            />
          </div>
          <SelectField
            label="Género"
            id="teacherGender"
            register={register}
            errors={errors}
            required
            options={genderOptions}
          />
          <InputField
            label="Lugar de Nacimiento:"
            id="teacherBirthPlace"
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
              id="teacherDocument"
              register={register}
              errors={errors}
              required
              options={documentOptions}
            />
          </div>
          <InputField
            label="Número de Documento:"
            id="teacherDocumentNumber"
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
          <InputField
            label="Número de Teléfono:"
            id="teacherPhone"
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
            id="teacherEmail"
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
          <InputField
            label="Profesión:"
            id="teacherProfession"
            register={register}
            errors={errors}
            required
            validation={{
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            }}
          />
          <SelectField
            label="Área de Especialización"
            id="teacherArea"
            register={register}
            errors={errors}
            required
            options={areaOptions}
          />
          <InputField
            label="Número de Resolución:"
            id="teacherResolutionNumber"
            type="text"
            register={register}
            errors={errors}
            required
            validation={{
              pattern: {
                value: /^\d{4,8}$/,
                message: "Resolución inválida (4-8 dígitos)",
              },
            }}
          />
          <SelectField
            label="Escalafon Docente"
            id="teacherScale"
            register={register}
            errors={errors}
            required
            options={scaleOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TabDocenteDatos;
