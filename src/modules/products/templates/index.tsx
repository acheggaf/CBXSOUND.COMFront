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

  useEffect(() => {
    // Move sanitization to useEffect to ensure it runs client-side
    if (productArticle?.html_content) {
      const cleanContent = DOMPurify.sanitize(productArticle.html_content)
      setSanitizedContent(cleanContent)
    }
  }, [productArticle?.html_content])

  if (!productArticle || !productArticle.id) {
    return null
  }

  const SafeExample: React.FC = () => (
    <div
      className="safe-example"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )

  return (
    <>
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
      <SafeExample />
    </>
  )
}

export default ProductTemplate