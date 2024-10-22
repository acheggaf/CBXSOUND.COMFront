import styles from "./style.module.css"

export default function Assistance() {
  return <>
    <div className={styles.container}>
        <div className={styles.assistancebanner}>
        <h2>Assistance</h2>
        <p>If you have any question make sure to contact us.</p>
        </div>
        <div className={styles.content}></div>
    </div>
  </>;
}
