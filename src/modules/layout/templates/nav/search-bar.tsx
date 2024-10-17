'use client';

import { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

export default function SearchBar() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleBlur = () => {
    setIsSearchVisible(false);
  };

  return (
    <div className={`${styles.searchContainer} ${isSearchVisible ? styles.searchActive : ''}`}>
      <div 
        className={`${styles.navicon} ${styles.search}`} 
        onClick={toggleSearch}
      ></div>
      <div className={styles.searchbar}>
        <input 
          type="text" 
          placeholder="Search..." 
          ref={searchInputRef}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}