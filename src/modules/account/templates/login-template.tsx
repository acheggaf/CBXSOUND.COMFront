"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import styles from './style.module.css'

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className={styles.container}>
      {/* Left section - Login/Register Forms */}
      <div className={styles.formSection}>
        {currentView === LOGIN_VIEW.SIGN_IN ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>

      {/* Right section - Promotional Content */}
      <div className={styles.promoSection}>
        <div className={styles.promoContent}>
          <h2 className={styles.promoTitle}>
            Unleash Your Creative Potential
          </h2>
          
          <div className={styles.promoFeatures}>
            <div className={styles.promoFeature}>
              <span className={styles.featureHighlight}>Professional Quality</span>
              <p>Industry-standard audio plugins trusted by top producers worldwide</p>
            </div>
            
            <div className={styles.promoFeature}>
              <span className={styles.featureHighlight}>Infinite Possibilities</span>
              <p>Create unique sounds with our versatile collection of effects and instruments</p>
            </div>
            
            <div className={styles.promoFeature}>
              <span className={styles.featureHighlight}>Intuitive Interface</span>
              <p>Designed for both beginners and professionals, with powerful yet accessible controls</p>
            </div>
          </div>

          <div className={styles.promoCTA}>
            <p className={styles.promoTagline}>
              Join thousands of musicians who have already elevated their sound
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
