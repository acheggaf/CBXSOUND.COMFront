'use client';
import { useState, type FC } from 'react';
import styles from './style.module.css';

export const MobileMenuWrapper: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      <button 
        className={`${styles.burgerMenu} ${isMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileNavLinks}>
          <a href="/products" className={styles.navlink}>Products</a>
          <a href="/community" className={styles.navlink}>Community</a>
          <a href="/assistance" className={styles.navlink}>Assistance</a>
        </div>
      </div>
    </>
  );
};