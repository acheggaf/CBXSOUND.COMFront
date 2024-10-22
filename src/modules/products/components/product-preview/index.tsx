import React from 'react';
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Text, } from "@medusajs/ui"
import { ProductPreviewType } from "types/global"
import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AddToCart from "@modules/cart/components/add-to-cart"
import Image from "next/image"
import PreviewPrice from "./price"
import styles from "./style.module.css"
import globalstyles from "../../../../styles/global.module.css"
import { FaInfoCircle } from "react-icons/fa";


export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
    region,
  })

  return (
    <div
      className={styles.link}
    >
      <div data-testid="product-wrapper" className={styles.productpreview}>
        <div className={styles.imageholder}>
        <Image
            src={productPreview.thumbnail}
            alt="Thumbnail"
            className={styles.image}
            draggable={false}
            quality={50}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            fill
          />
        </div>
        <div className={styles.contentholder}>
          <Text className={`${styles.plugintitle} ${styles.alignText}`} data-testid="product-title">{productPreview.title}</Text>
          <Text className={`${styles.plugindesc} ${styles.alignText}`}>{pricedProduct.description || "Product description"}</Text>
          <div className="flex justify-between items-center mb-4">
            {cheapestPrice && <PreviewPrice price={cheapestPrice}/>}
            <FaInfoCircle size={14} /> 
          </div>
          <a href={`/products/${pricedProduct.handle}`} className={`${globalstyles.custombutton} ${globalstyles.whitebutton}`}>Learn more</a>
          <AddToCart product={pricedProduct} />
        </div>
      </div>
    </div>
  )
}