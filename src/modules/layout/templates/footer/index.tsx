import { getCategoriesList, getCollectionsList } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "./style.module.css"
import { FaCcVisa, FaPaypal, FaYoutube, FaLinkedin, FaInstagram  } from "react-icons/fa";
import { RiMastercardFill } from "react-icons/ri";
import { SiAmericanexpress } from "react-icons/si";

export default async function Footer() {
  const { collections } = await getCollectionsList(0, 4)
  const { product_categories } = await getCategoriesList(0, 4)

  return (
    <footer className="bg-black text-white w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 md:flex-row items-start justify-between py-16">
          {/* CBX Column */}
          <div className="flex flex-col gap-y-4 md:w-1/3">
              <div className={styles.logoimg}></div>
            <p className={styles.textsm}>Some of our payment methods are :</p>
            <div className="flex space-x-4">
              <FaCcVisa size={30} />
              <RiMastercardFill size={30} />
              <FaPaypal size={28} />
              <SiAmericanexpress size={24} /> 
            </div>
            <h3 className="text-lg font-semibold mt-4">Social Media</h3>
            <div className="flex space-x-4">
              <FaYoutube size={24} />
              <FaLinkedin size={22} />
              <FaInstagram size={24} />
            </div>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-y-4 md:w-1/3">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="grid grid-cols-1 gap-2">
              {collections?.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-gray-300 text-sm"
                    href={`/collections/${c.handle}`}
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* About us Column */}
          <div className="flex flex-col gap-y-4 md:w-1/3">
            <h3 className="text-lg font-semibold">About us</h3>
            <ul className="grid grid-cols-1 gap-2">
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-gray-300 text-sm">
                  Contact
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/community" className="hover:text-gray-300 text-sm">
                  Community
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/company" className="hover:text-gray-300 text-sm">
                  Company
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex w-full mb-8 justify-between text-gray-400 border-t border-gray-700 pt-8">
          <p className="text-sm">
            © {new Date().getFullYear()} CBX Sound. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:underline">Legal notices</a>
            <a href="#" className="hover:underline">Data privacy policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}