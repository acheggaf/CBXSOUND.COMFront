import styles from "./style.module.css";
import { listRegions } from "@lib/data";
import SearchBar from "./search-bar";

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions);

  return (
    <div className={styles.navbar}>
      <div className={styles.logoholder}>
        <a href="/us/" className={styles.logoimg}></a>
      </div>
      <div className={styles.navlinks}>
        <a href="/#" className={styles.navlink}>Products</a>
        <a href="/#" className={styles.navlink}>Community</a>
        <a href="/#" className={styles.navlink}>Assistance</a>
      </div>
      <div className={styles.iconHolder}>
        <a href="/#" className={`${styles.navicon} ${styles.userlogin}`}></a>
        <div className={`${styles.navicon} ${styles.cart}`}></div>
        <SearchBar />
      </div>
    </div>
  );
}