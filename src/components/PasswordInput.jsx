import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  show,
  setShow,
}) {
  return (
    <div className="field">

      <label>{label}</label>

      <div className="input-container">

        <LockKeyhole />

        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />

        <button
          type="button"
          className="eye"
          onClick={() => setShow(!show)}
        >

          {show ? (
            <EyeOff />
          ) : (
            <Eye />
          )}

        </button>

      </div>

    </div>
  );
}

export default PasswordInput;