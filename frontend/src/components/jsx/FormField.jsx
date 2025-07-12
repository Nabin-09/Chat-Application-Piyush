import { useState } from 'react';
import styles from '../css/FormField.module.css';

function FormField({ label, type, name, value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && !showPassword ? 'password' : 'text';

  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={name}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className={styles.input}
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className={styles.toggleButton}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            aria-label="Toggle password visibility"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
}

export default FormField;
