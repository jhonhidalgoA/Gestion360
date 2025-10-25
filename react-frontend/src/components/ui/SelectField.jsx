import "./SelectField.css"; 

const SelectField = ({
  label,
  id,
  register,
  errors,
  required = false,
  validation = {},
  options = [],
  ...props
}) => {
  const errorMsg = errors?.[id]?.message;

  return (
    <div className="group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...register(id, {
          required: required ? "Este campo es obligatorio" : false,
          ...validation,
        })}
        className={`input-line ${errorMsg ? "input-error" : ""}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMsg && <span className="error-message">{errorMsg}</span>}
    </div>
  );
};

export default SelectField;