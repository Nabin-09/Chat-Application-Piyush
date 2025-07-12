import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormField from './FormField';
import ErrorMessage from './ErrorMessage';
import styles from '../css/LoginForm.module.css';
import apiClient from '../helper/apiClient.js';

function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(formData);
      console.log('Login response:', response);

      const res = await apiClient.login(formData);
localStorage.setItem('user', JSON.stringify(res.user)); // must include image
setUser(res.user); // or set in context/state
navigate('/chat'); // or wherever


      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));

      // Set user state
      setUser(response.user);

      // Navigate to user list
      navigate('/users');
    } catch (err) {
      console.error('Login error:', err);
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
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>

        <ErrorMessage message={error} />

        <FormField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles.switchForm}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;