import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../helper/apiClient.js';
import socket from '../helper/socket.js';
import styles from '../css/Navbar.module.css';

function Navbar({ user, setUser }) {
  // const [currentUser, setCurrentUser] = useState(null);
  const currentUser = user;
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/40');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user from localStorage and profile image
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Navbar: Current user:', parsedUser);
      // setCurrentUser(parsedUser);

      // Fetch user details for profile image
      apiClient.getUser(parsedUser.id)
        .then(data => {
          setProfileImage(data.image || 'https://via.placeholder.com/40');
          console.log('Navbar: Profile image set:', data.image);
        })
        .catch(err => {
          console.error('Navbar: Error fetching user image:', err);
        });
    } else {
      console.warn('Navbar: No user data in localStorage');
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Navbar: Logging out user:', currentUser?.id);
    localStorage.removeItem('user');
    socket.emit('unregister', { user_id: currentUser?.id });
    socket.disconnect();
    setUser(null);
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/" className={styles.brandLink}>
          TeamTalk
        </Link>
      </div>
      <div className={styles.navbarMenu}>
        <span className={styles.userInfo}>
          Welcome{currentUser?.username ? `, ${currentUser.username}` : ''}
        </span>

        {currentUser ? (
          <>
            <Link to="/users" className={styles.navLink}>User List</Link>
            <div className={styles.profileContainer}>
              <img
                src={`http://localhost:8080${currentUser?.image || '/default.png'}`}
                alt="Profile"
                className={styles.profileImage}
                onClick={toggleDropdown}
              />

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className={styles.navLink}>Login</Link>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
