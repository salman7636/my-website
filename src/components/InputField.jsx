function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon,
  disabled = false,
}) {
  return (
    <div className="field">

      <label>{label}</label>

      <div className="input-container">

        {icon}

        <input
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />

      </div>

    </div>
  );
}

export default InputField;