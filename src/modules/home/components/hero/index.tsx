import { Button } from "@medusajs/ui"
import styles from "./style.module.css";

const Hero = () => {
  return (
    <div className={styles.mainBanner}>
      <video 
        id={styles.videoPlayer} 
        autoPlay 
        loop 
        muted 
        preload="metadata" 
        playsInline 
        src="/vid/banner.mp4" 
        x-webkit-airplay="allow"
      />
      <div className={styles.blurredPanel}>
        <div className={styles.contentWrapper}>
          <div className={styles.contentHeader}>
              <div className={styles.bphtitle}> Flow</div>
              <Button variant="primary" className={styles.getItNowButton}>
                Get it Now
              </Button>
            
          </div>
          <div className={styles.contentbody}>
            Get our new effect modulation plugin for a very affordable price right now, check the offer.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero