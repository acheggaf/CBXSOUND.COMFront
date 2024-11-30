import { getCategoriesList, getProductsList } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "./style.module.css"
import { FaCcVisa, FaPaypal, FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa"
import { RiMastercardFill } from "react-icons/ri"
import { SiAmericanexpress } from "react-icons/si"

export default async function Footer() {
  const { response: { products } } = await getProductsList({
    pageParam: 0,
    queryParams: { limit: 4 },
    countryCode: 'us'
  })
  const { product_categories } = await getCategoriesList(0, 4)
  
  return (
    <footer className="bg-black text-white w-full">
      <div className={styles.footerContainer}>
        <div className={styles.columnsContainer}>
          {/* CBX Column */}
          <div className={styles.column}>
            <div className={styles.logoimg}></div>
            <p className={styles.textsm}>Some of our payment methods are:</p>
            <div className={`${styles.iconContainer} ${styles.paymentMethods}`}>
              <FaCcVisa size={30} className={styles.icon} />
              <RiMastercardFill size={30} className={styles.icon} />
              <FaPaypal size={28} className={styles.icon} />
              <SiAmericanexpress size={24} className={styles.icon} />
            </div>
            <h3 className="text-lg font-semibold mt-4">Social Media</h3>
            <div className={`${styles.iconContainer} ${styles.socialMedia}`}>
              <FaYoutube size={24} className={styles.icon} />
              <FaLinkedin size={22} className={styles.icon} />
              <FaInstagram size={24} className={styles.icon} />
            </div>
          </div>
          
          {/* Products Column */}
          <div className={styles.column}>
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="grid gap-2 mt-2">
              {products?.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <LocalizedClientLink
                    className={styles.link}
                    href={`/products/${p.handle}`}
                  >
                    {p.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* About us Column */}
          <div className={styles.column}>
            <h3 className="text-lg font-semibold">About us</h3>
            <ul className="grid gap-2 mt-2">
              <li>
                <LocalizedClientLink href="/contact" className={styles.link}>
                  Contact
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/community" className={styles.link}>
                  Community
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/company" className={styles.link}>
                  Company
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <p className={styles.textsm}>
            © {new Date().getFullYear()} CBX Sound. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.link}>Legal notices</a>
            <a href="#" className={styles.link}>Data privacy policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}