'use client'
import { Region } from "@medusajs/medusa"
import { ProductArticle } from "types/global"
import React, { useEffect, useState } from "react"
import styles from "./style.module.css"
import DOMPurify from 'dompurify'

export const isServer = typeof window === "undefined"

type ProductTemplateProps = {
  productArticle: ProductArticle
  region: Region
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  productArticle,
  region,
  countryCode,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState("")
  const [processedStyles, setProcessedStyles] = useState("")

  useEffect(() => {
    if (!productArticle) return

    // Configure DOMPurify to allow onclick attribute
    const purifyConfig = {
      ADD_TAGS: ['style', 'script'],
      ADD_ATTR: ['onclick', 'type'], // Add onclick to allowed attributes
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

      // Process CSS content
      if (productArticle.css_content) {
        const scopedId = `style-${productArticle.id}`
        const scopedCSS = productArticle.css_content.replace(
          /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
          `.scoped-${scopedId} $1$2`
        )
        setProcessedStyles(scopedCSS)
      }

      // Add the JavaScript function to window scope
      if (productArticle.js_content) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.textContent = productArticle.js_content
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Error processing content:', error)
    }
  }, [productArticle])

  if (!productArticle || !productArticle.id) {
    return null
  }

  const scopedId = `style-${productArticle.id}`

  return (
    <>
      {/* Inject scoped styles */}
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
            alt={`Product image ${productArticle.id + 1}`}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <div className={`safe-example scoped-${scopedId}`}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </div>
    </>
  )
}

export default ProductTemplate