import {useState} from "react";
import "./TabEstudiante.css";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";

const TabEstudiante = ({ register, errors, setValue }) => {
  const documentOptions = [
    { value: "", label: "Seleccionar" },
    { value: "RC", label: "Registro Civil (RC)" },
    { value: "TI", label: "Tarjeta de Identidad (TI)" },
    { value: "CC", label: "Cédula de Ciudadanía (CC)" },
    { value: "CE", label: "Cédula de Extranjería (CE)" },
    { value: "PEP", label: "Permiso Especial de Permanencia (PEP)" },
  ];

  const genderOptions = [
    { value: "", label: "Seleccionar" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "binario", label: "No Binario" },
  ];

  const bloodOptions = [
    { value: "", label: "Seleccionar" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const gradeOptions = [
    { value: "", label: "Seleccionar" },
    { value: "preescolar", label: "Preescolar" },
    { value: "primero", label: "Primero" },
    { value: "segundo", label: "Segundo" },
    { value: "tercero", label: "Tercero" },
    { value: "cuarto", label: "Cuarto" },
    { value: "quinto", label: "Quinto" },
    { value: "sexto", label: "Sexto" },
    { value: "septimo", label: "Séptimo" },
    { value: "octavo", label: "Octavo" },
    { value: "noveno", label: "Noveno" },
    { value: "decimo", label: "Décimo" },
    { value: "undecimo", label: "Undécimo" },
  ];

  const [preview, setPreview] = useState(null);
  const [age, setAge] = useState("");

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "";
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge > 0 ? calculatedAge : "";
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    const calculatedAge = calculateAge(value);
    setAge(calculatedAge);   
    setValue("studentAge", calculatedAge);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="tab-content">
      <div className="photo-container">
        <label
          htmlFor="student-photo"
          className={`photo-label ${errors.studentPhoto ? "photo-error" : ""}`}
        >
          <span>{preview ? "" : "Foto del Estudiante"}</span>
          <input
            type="file"
            id="student-photo"
            {...register("studentPhoto", {
              required: "Debe subir una foto del estudiante",
              validate: {
                isImage: (files) => {
                  if (!files || files.length === 0)
                    return "Debe subir una foto";
                  const file = files[0];
                  return (
                    file.type.startsWith("image/") ||
                    "Solo se permiten imágenes"
                  );
                },
                maxSize: (files) => {
                  if (!files || files.length === 0) return true;
                  const file = files[0];
                  return (
                    file.size <= 5 * 1024 * 1024 ||
                    "La imagen debe pesar menos de 5MB"
                  );
                },
              },
            })}
            accept="image/*"
            onChange={handlePhotoChange}
            className="visually-hidden"
          />
          <div
            className="photo-preview"
            style={{
              backgroundImage: preview ? `url(${preview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: preview ? "none" : "2px dashed #adb5bd",
            }}
          >            
          </div>
        </label>
        {errors.studentPhoto && (
          <span
            className="error-message"
            style={{ display: "block", marginTop: "0.5rem" }}
          >
            {errors.studentPhoto.message}
          </span>
        )}
      </div>

      <div className="register-fields">
        <h3>Datos del estudiante</h3>
        <div className="field-row">
          <div className="group">
            <label htmlFor="register-date">Fecha de Matrícula:</label>
            <input
              type="date"
              className="input-autofill"
              id="register-date"
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
              {...register("codigo")}
              readOnly
            />
          </div>
          <InputField
            label="Nombres:"
            id="name"
            register={register}
            errors={errors}
            required
            validation={{
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "Solo letras y espacios",
              },
            }}
          />
          <InputField
            label="Apellidos:"
            id="lastname"
            register={register}
            errors={errors}
            required
            validation={{
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "Solo letras y espacios",
              },
            }}
          />
        </div>
        
        <div className="field-row">
          <div className="group">
            <label htmlFor="studentBirthDate">Fecha de Nacimiento</label>
            <input
              type="date"
              id="studentBirthDate"
              {...register("studentBirthDate", {
                required: "Requerido",
                validate: (value) => {
                  if (!value) return "Requerido";
                  const date = new Date(value);
                  return !isNaN(date) || "Fecha inválida";
                },
              })}
              onChange={handleBirthDateChange}
              className={`input-line ${errors.studentBirthDate ? "error" : ""}`}
            />
            {errors.studentBirthDate && (
              <p className="field-error">{errors.studentBirthDate.message}</p>
            )}
          </div>         
          <div className="group">
            <label htmlFor="studentAge">Edad:</label>
            <input
              type="number"
              id="studentAge"
              value={age}
              readOnly
              className="input-line"
              placeholder="Auto"
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
            }}
          />
        </div>

        {/* Fila 3 */}
        <div className="field-row">
          <SelectField
            label="Tipo de Documento:"
            id="studentDocument"
            register={register}
            errors={errors}
            required
            options={documentOptions}
          />
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

        {/* Fila 4 */}
        <div className="field-row">
          <SelectField
            label="Grupo Sanguíneo:"
            id="studentBlood"
            register={register}
            errors={errors}
            required
            options={bloodOptions}
          />
          <InputField
            label="EPS:"
            id="studentEPS"
            register={register}
            errors={errors}
            required
          />
          <SelectField
            label="Grado al que ingresa"
            id="studentGrade"
            register={register}
            errors={errors}
            required
            options={gradeOptions}
          />
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
        </div>
      </div>
    </div>
  );
};

export default TabEstudiante;
