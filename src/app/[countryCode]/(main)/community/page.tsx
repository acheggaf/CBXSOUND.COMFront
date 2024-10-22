import styles from "./style.module.css"

export default function Community() {
  return <>
    <div className={styles.container}>
        <div className={styles.communitybanner}>
        <h2>Community</h2>
        <p>Find us and join our community members</p>
        </div>
        <div className={styles.content}></div>
    </div>
  </>;
}
