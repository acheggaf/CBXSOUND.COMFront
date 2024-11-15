'use client'
import { Region } from "@medusajs/medusa"
import { ProductArticle } from "types/global"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { getProductPrice } from "@lib/util/get-product-price"
import React, { useEffect, useState } from "react"
import AddToCart from "@modules/cart/components/add-to-cart"
import { FaPaypal, FaCcVisa, FaCcMastercard, FaCcStripe, FaGooglePay, FaApplePay } from "react-icons/fa"
import styles from "./style.module.css"
import DOMPurify from 'dompurify'

export const isServer = typeof window === "undefined"

type ProductTemplateProps = {
  product: PricedProduct | null
  productArticle: ProductArticle
  region: Region
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  productArticle,
  region,
  countryCode,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState("")
  const [processedStyles, setProcessedStyles] = useState("")
  const [price, setPrice] = useState<string>("")
  
  useEffect(() => {
    if (!productArticle) return

    const purifyConfig = {
      ADD_TAGS: ['style', 'script', 'iframe'],
      ADD_ATTR: [
        'onclick',
        'type',
        'src',
        'frameborder',
        'allowfullscreen',
        'allow',
        'scrolling',
        'width',
        'height'
      ],
      FORCE_BODY: true,
    }

    try {
      if (productArticle.html_content) {
        const cleanContent = DOMPurify.sanitize(
          productArticle.html_content,
          purifyConfig
        )
        setSanitizedContent(cleanContent)
      }

      if (productArticle.css_content) {
        const scopedId = `style-${productArticle.id}`
        const scopedCSS = productArticle.css_content.replace(
          /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
          `.scoped-${scopedId} $1$2`
        )
        setProcessedStyles(scopedCSS)
      }

      if (!isServer && productArticle.js_content) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.textContent = productArticle.js_content
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Error processing content:', error)
    }
  }, [productArticle])

  useEffect(() => {
    try {
      if (product && region) {
        const { cheapestPrice } = getProductPrice({ 
          product, 
          region 
        })
        setPrice(cheapestPrice?.original_price?.toString() || '0')
      }
    } catch (error) {
      console.error('Error getting product price:', error)
      setPrice('0')
    }
  }, [product, region])

  if (!productArticle || !productArticle.id) {
    return <div className="text-center p-4">Product article not found</div>
  }

  const scopedId = `style-${productArticle.id}`

  return (
    <>
      {processedStyles && (
        <style>
          {processedStyles}
        </style>
      )}

      <div className={styles.contentContainer}>
        {productArticle.banner_image && (
          <img
            src={productArticle.banner_image}
            className={styles.bannerimage}
            alt={`Product image ${productArticle.id}`}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>
      
      <div className={styles.navbar_section}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            {product?.title || 'Product Title'}
          </div>
              
          <div className={styles.nav_links}>
            <a href="#OverviewSection" className={styles.nav_link}>Overview</a>
            <a href="#SoundSection" className={styles.nav_link}>Sound</a>
            <a href="#RequirementsSection" className={styles.nav_link}>Requirements</a>
            <AddToCart product={product!} message={`Purchase ${price ? price : ''}`}/>
          </div>
        </div>
      </div>

      <div className={`safe-example scoped-${scopedId}`}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>


      {/*-------------------------------------------------------------*/}






      <div className={styles.purshase_section}>
        <div className={styles.purshase_product_title}>Get yours Now!</div>
        <div className={styles.purshase_button}>
          <AddToCart product={product!} message={`Purchase ${price ? price : ''}`}/>
        </div>
        <div className={styles.payment_ways}>
          <div className={styles.payment_icon}>
            <FaPaypal size={40} />
          </div>
          <div className={styles.payment_icon}>
            <FaCcStripe size={40} />
          </div>
          <div className={styles.payment_icon}>
            <FaCcVisa size={40} />
          </div>
          <div className={styles.payment_icon}>
            <FaCcMastercard size={40} />
          </div>
          <div className={styles.payment_icon}>
            <FaGooglePay size={40} />
          </div>
          <div className={styles.payment_icon}>
            <FaApplePay size={40} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate