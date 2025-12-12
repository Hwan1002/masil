const InputField = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div className="inputAll">
    <label className="dpLabel" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      className="form-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default InputField;
