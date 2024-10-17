import { Suspense } from "react"
import styles from "./style.module.css"
import { listRegions } from "@lib/data"
import Image from 'next/image';
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)

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

   </div>
  )
}
