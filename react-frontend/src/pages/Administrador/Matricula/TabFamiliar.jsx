import React from "react";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";
import "./TabEstudiante.css"; // Usa los mismos estilos

const TabFamiliar = ({ register, errors }) => {
  const documentTypes = [
    { value: "", label: "Seleccionar" },
    { value: "RC", label: "Registro Civil (RC)" },
    { value: "TI", label: "Tarjeta de Identidad (TI)" },
    { value: "CC", label: "Cédula de Ciudadanía (CC)" },
    { value: "CE", label: "Cédula de Extranjería (CE)" },
    { value: "PEP", label: "Permiso Especial de Permanencia (PEP)" },
  ];

  return (
    <div className="tab-content">
      <div className="register-fields">
        
        <div className="field-row">
          <div className="group">
            <InputField
              label="Nombre de la Madre:"
              id="motherName"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Apellidos de la Madre:"
              id="motherLastname"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
          <div className="group">
            <SelectField
              label="Tipo de Documento:"
              id="motherTypeDocument"
              register={register}
              errors={errors}
              required
              options={documentTypes}
            />
          </div>
          <div className="group">
            <InputField
              label="Número de Documento:"
              id="motherDocument"
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
        </div>
        
        <div className="field-row">
          <div className="group">
            <InputField
              label="Teléfono:"
              id="motherPhone"
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
          </div>
          <div className="group">
            <InputField
              label="Correo Electrónico:"
              id="motherEmail"
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
          <div className="group">
            <InputField
              label="Profesión:"
              id="motherProfesion"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Ocupación:"
              id="motherOcupation"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
            />
          </div>
        </div>

        
        <div className="field-row">
          <div className="group">
            <InputField
              label="Nombre del Padre:"
              id="fatherName"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Apellidos del Padre:"
              id="fatherLastname"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: "Solo letras y espacios",
                },
              }}
            />
          </div>
          <div className="group">
            <SelectField
              label="Tipo de Documento:"
              id="fatherTypeDocument"
              register={register}
              errors={errors}
              required
              options={documentTypes}
            />
          </div>
          <div className="group">
            <InputField
              label="Número de Documento:"
              id="fatherDocument"
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
        </div>

        <div className="field-row">
          <div className="group">
            <InputField
              label="Teléfono:"
              id="fatherPhone"
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
          </div>
          <div className="group">
            <InputField
              label="Correo Electrónico:"
              id="fatherEmail"
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
          <div className="group">
            <InputField
              label="Profesión:"
              id="fatherProfesion"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Ocupación:"
              id="fatherOcupation"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabFamiliar;