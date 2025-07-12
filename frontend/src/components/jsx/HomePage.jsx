import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/HomePage.module.css';
import Image from '../../assets/image.jpg';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Welcome to My App</h1>
        <p>
          Discover a seamless messaging experience with My App! Stay connected with friends and family, enjoy vibrant chat themes, and explore exciting features designed to enhance your communication. Join us today!
        </p>
        <button className={styles.getStarted} onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      <div className={styles.backgroundImage}>
        <img src={Image} alt="App Background" />
      </div>
    </div>
  );
}

export default HomePage;