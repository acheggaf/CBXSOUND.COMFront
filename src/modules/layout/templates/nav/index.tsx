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
        <a href="/products" className={styles.navlink}>Products</a>
        <a href="/#" className={styles.navlink}>Community</a>
        <a href="/#" className={styles.navlink}>Assistance</a>
      </div>
      <div className={styles.iconHolder}>
        <a href="/account" className={`${styles.navicon} ${styles.userlogin}`}></a>
        <a href="/cart"  className={`${styles.navicon} ${styles.cart}`}></a>
        <SearchBar />
      </div>
    </div>
  );
}