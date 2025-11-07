const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
}) => (
  <div className="div-input">
    <label>{label}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
      value={value}
    />
  </div>
);

export default InputField;

