import styles from "./style.module.css"

export default function Activation() {
  return (
    <div className={styles.activationGuide}>
      <h1>How to Activate Your Plugin</h1>
      
      <div className={styles.steps}>
        <div className={styles.step}>
          <h2>Step 1: Download Your Plugin</h2>
          <p>After your purchase, download the plugin version compatible with your operating system from the downloads section above.</p>
          <div className={styles.activationwebsite}></div>
        </div>

        <div className={styles.step}>
          <h2>Step 2: Install the Plugin</h2>
          <p>Run the installer and follow the installation instructions for your system.</p>
        </div>

        <div className={styles.step}>
          <h2>Step 3: Get Your Machine ID</h2>
          <p>When you first open the plugin, you'll see the activation screen. The plugin will generate a unique machine ID code. Copy this code.</p>
        </div>

        <div className={styles.step}>
          <h2>Step 4: Generate Your License</h2>
          <p>Return to this website and:</p>
          <ul>
            <li>Go to your purchased products</li>
            <li>Find the plugin you want to activate</li>
            <li>Paste your machine ID in the input field</li>
            <li>Click "Generate New License"</li>
          </ul>
        </div>

        <div className={styles.step}>
          <h2>Step 5: Activate Your Plugin</h2>
          <p>Copy the generated license key and paste it into the plugin's activation screen. Click "Validate" to complete the activation.</p>
        </div>

        <div className={styles.troubleshooting}>
          <h2>Having Issues?</h2>
          <p>If you encounter any problems during activation:</p>
          <ul>
            <li>Make sure you're copying the entire machine ID and license key</li>
            <li>Check that you're using the correct version for your operating system</li>
            <li>Try restarting your DAW after activation</li>
            <li>Contact our support if you need further assistance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}