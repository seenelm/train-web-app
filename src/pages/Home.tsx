import React, { useState, useEffect } from 'react';
import logo from '@/assets/logo.svg';
import logoWhite from '@/assets/logo-white.svg';
import './Home.css';

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <img 
          src={isDarkMode ? logoWhite : logo} 
          alt="Train Logo" 
          className="home-logo" 
        />
        <h1 className="home-title">Welcome to Train App!</h1>
        <p className="home-subtitle">
          The first program management tool built for coaches and athletes
        </p>
      </div>
    </div>
  );
};

export default Home;
