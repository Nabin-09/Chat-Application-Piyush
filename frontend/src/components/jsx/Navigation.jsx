import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Navigation.module.css';

function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          Chat App
        </Link>
        <div className={styles.navLinks}>
          {user ? (
            <>
              <span className={styles.username}>Hello, {user.username}</span>
              <Link to="/users" className={styles.navLink}>
                Users
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;