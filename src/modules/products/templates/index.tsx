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

// Utility to check if code is running on server
export const isServer = typeof window === "undefined"

// Function to properly process CSS with media queries
const processStyles = (cssContent: string, scopedId: string): string => {
  // First, let's separate the CSS into regular rules and media queries
  const cssPartsArray = cssContent.split('@media')
  
  // Process the main CSS rules (first part)
  let processedCSS = cssPartsArray[0].replace(
    /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
    `.scoped-${scopedId} $1$2`
  )
  
  // Process each media query while maintaining its structure
  if (cssPartsArray.length > 1) {
    for (let i = 1; i < cssPartsArray.length; i++) {
      const mediaQuery = cssPartsArray[i]
      const mediaQueryParts = mediaQuery.split('{')
      const mediaQueryCondition = mediaQueryParts[0]
      
      // Reconstruct the media query with properly scoped selectors
      processedCSS += `@media ${mediaQueryCondition} {`
      
      // Scope the contents of the media query
      const scopedMediaContent = mediaQueryParts.slice(1).join('{').replace(
        /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
        `.scoped-${scopedId} $1$2`
      )
      
      processedCSS += scopedMediaContent
    }
  }
  
  return processedCSS
}

// Component props type definition
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
  // State management for processed content
  const [sanitizedContent, setSanitizedContent] = useState("")
  const [processedStyles, setProcessedStyles] = useState("")
  const [price, setPrice] = useState<string>("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Function to close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Effect for processing HTML, CSS, and JS content
  useEffect(() => {
    if (!productArticle) return

    // Configure DOMPurify to allow necessary tags and attributes
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
      // Process HTML content
      if (productArticle.html_content) {
        const cleanContent = DOMPurify.sanitize(
          productArticle.html_content,
          purifyConfig
        )
        setSanitizedContent(cleanContent)
      }

      // Process CSS content with improved media query handling
      if (productArticle.css_content) {
        const scopedId = `style-${productArticle.id}`
        const processedCSS = processStyles(productArticle.css_content, scopedId)
        setProcessedStyles(processedCSS)
        
        // Debug logging for CSS processing
        console.log('Original CSS:', productArticle.css_content)
        console.log('Processed CSS:', processedCSS)
      }

      // Handle JavaScript content
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

  // Effect for handling product price
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

  // Early return if no product article
  if (!productArticle || !productArticle.id) {
    return <div className="text-center p-4">Product article not found</div>
  }

  const scopedId = `style-${productArticle.id}`

  return (
    <>
      {/* Inject processed styles */}
      {processedStyles && (
        <style>
          {processedStyles}
        </style>
      )}

      {/* Content container */}
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

      {/* Navigation section */}
      <div className={styles.navbar_section}>
        <div className={styles.navbar}>

          {/* Burger Menu Button */}
          <button 
                className={`${styles.burger_menu} ${isMenuOpen ? styles.open : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
              >
                <div className={styles.burger_line}></div>
                <div className={styles.burger_line}></div>
                <div className={styles.burger_line}></div>
          </button>

          <div className={styles.logo}>
            {product?.title || 'Product Title'}
          </div>
              
          <div className={`${styles.nav_links} ${isMenuOpen ? styles.open : ''}`}>
            <a href="#OverviewSection" className={styles.nav_link}>Overview</a>
            <a href="#SoundSection" className={styles.nav_link}>Sound</a>
            <a href="#RequirementsSection" className={styles.nav_link}>Requirements</a>
            <AddToCart product={product!} message={`Purchase ${price ? price : ''}`}/>
          </div>
        </div>
      </div>

      {/* Main content section with scoped styling */}
      <div className={`safe-example scoped-${scopedId} debug-styling`}>
        <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>

      {/* Purchase section */}
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