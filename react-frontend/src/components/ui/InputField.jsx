
const InputField = ({
  label,
  id,
  type = "text",
  register,
  errors,
  required = false,
  validation = {},
  readOnly = false,
  placeholder = "",
  ...props
}) => {
  const errorMsg = errors?.[id]?.message;

  return (
    <div className="group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        {...register(id, {
          required: required ? "Este campo es obligatorio" : false,
          ...validation,
        })}
        className={errorMsg ? "input-error" : ""}
        readOnly={readOnly}
        placeholder={placeholder}
        {...props}
      />
      {errorMsg && <span className="error-message">{errorMsg.message || errorMsg}</span>}
    </div>
  );
};

export default InputField;