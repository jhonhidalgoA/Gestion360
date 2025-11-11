import "./TabGeneral.css";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";

const TabAcademica = ({ register, errors }) => {
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

  const gradeEthnic = [
    { value: "", label: "Seleccionar" },
    { value: "indigena", label: "Indígena" },
    { value: "afro", label: "Afrocolombiano" },
    { value: "raizal", label: "Raizal" },
    { value: "gitano", label: "Gitanos" },
    { value: "ninguna", label: "Ninguno" },
  ];

  const gradeReference = [
    { value: "", label: "Seleccionar" },
    { value: "victima", label: "Victima de conflicto armado" },
    { value: "desplazado", label: "Desplazado" },
    { value: "icbf", label: "Proveniente de ICBF" },
    { value: "ninguno", label: "Ninguno" },
  ];

  const studentStatus = [
    { value: "", label: "Seleccionar" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
  ];

  const studentZone = [
    { value: "", label: "Seleccionar" },
    { value: "urbana", label: "Urbana" },
    { value: "rural", label: "Rural" },
  ];

  return (
    <div className="tab-content">
      <div className="register-fields">
        <h3>Información General</h3>
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
            validation={{
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
            }}
          />
          <SelectField
            label="Grupo Étnico:"
            id="studentEthnic"
            register={register}
            errors={errors}
            required
            options={gradeEthnic}
          />
          <SelectField
            label="Información Referencial:"
            id="studentReference"
            register={register}
            errors={errors}
            required
            options={gradeReference}
          />
        </div>        
        <div className="field-row">
          <div className="group">
            <InputField
              label="Dirección de Residencia:"
              id="studentAddress"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Barrio:"
              id="studentNeighborhood"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              }}
            />
          </div>
          <div className="group">
            <InputField
              label="Localidad:"
              id="studentLocality"
              register={register}
              errors={errors}
              required
              validation={{
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: { value: 100, message: "Máximo 100 caracteres" },
              }}
            />
          </div>
          <div className="group">
            <SelectField
              label="Estrato:"
              id="studentStatus"
              register={register}
              errors={errors}
              required
              options={studentStatus}
            />
          </div>
          <div className="group">
            <SelectField
              label="Zona:"
              id="studentZone"
              register={register}
              errors={errors}
              required
              options={studentZone}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabAcademica;
