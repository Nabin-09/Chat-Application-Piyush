import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormField from './FormField';
import ErrorMessage from './ErrorMessage';
import styles from '../css/RegistrationForm.module.css';
import apiClient from '../helper/apiClient';

function RegistrationForm({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);
  //   try {
  //     await apiClient.register(formData);
  //     navigate('/login');
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    console.log("Sending request:", formData);
    const response = await apiClient.register(formData);
    console.log("Success:", response);
    setUser(response.user);
    navigate('/login');
  } catch (err) {
    console.error("Error:", err);
    if (err.response) {
      setError(err.response.data.message);
    } else if (err.request) {
      setError("No response from server");
    } else {
      setError("Error: " + err.message);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        <ErrorMessage message={error} />
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Register'}
        </button>
        <p className={styles.toggle}>
          Already have an account? <Link className={styles.toggleLink} to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;