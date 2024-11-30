import { type FC } from 'react';
import { MobileMenuWrapper } from '@modules/layout/components/mobile-nav';
import CartButton from "@modules/layout/components/cart-button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import styles from './style.module.css'

export default function Nav() {
  return (
    <>
      <div className={styles.navbar}>
        <MobileMenuWrapper />
        
        {/* Logo */}
        <div className={styles.logoholder}>
          <a href="/us/" className={styles.logoimg}></a>
        </div>

        {/* Desktop Nav Links */}
        <div className={styles.navlinks}>
          <a href="/products" className={styles.navlink}>Products</a>
          <a href="/community" className={styles.navlink}>Community</a>
          <a href="/assistance" className={styles.navlink}>Assistance</a>
        </div>

        {/* Icons */}
        <div className={styles.iconHolder}>
          <a href="/account" className={`${styles.navicon} ${styles.userlogin}`}></a>
          <CartButton />
          <LocalizedClientLink
            href="/search"
            scroll={false}
            data-testid="nav-search-link"
          >
            <div className={`${styles.navicon} ${styles.search}`}></div>
          </LocalizedClientLink>
        </div>
      </div>
    </>
  );
}