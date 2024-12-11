// WelcomeHeader.tsx
import React from 'react';
import styles from './styles.module.css';

// Define the props interface for better type safety
interface WelcomeHeaderProps {
  customerName: string;
}

// The WelcomeHeader component provides a stylized welcome message with a decorative background
const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ customerName }) => {
  return (
    // The outer container ensures proper width and overflow handling
    <div className={styles.headerContainer}>
      {/* The background container holds the SVG pattern and overlay effects */}
      <div className={styles.backgroundContainer}>
        {/* The content wrapper ensures proper text positioning and visibility */}
        <div className={styles.contentWrapper}>
          <h3 className={styles.welcomeText}>
            Welcome, {customerName}
          </h3>
        </div>
        {/* The overlay adds a subtle darkening effect and blur for better text readability */}
        <div className={styles.overlay}></div>
      </div>
    </div>
  );
};

export default WelcomeHeader;