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
        <Text className="text-xl font-bold mb-2" data-testid="product-title">{productPreview.title}</Text>
        <Text className="text-sm mb-4">{productPreview.title || "Product description"}</Text>
        <div className="flex justify-between items-center mb-4">
          {cheapestPrice && <PreviewPrice price={cheapestPrice}/>}
          <FaInfoCircle size={14} /> 
        </div>
        <div className="flex space-x-2 mb-4">
          <button className="bg-white text-black px-4 py-2 rounded flex-grow">Learn more</button>
          <button className="bg-white text-black px-4 py-2 rounded flex-grow">Free trial</button>
        </div>
        <AddToCart product={pricedProduct} />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Buy now</button>
      </div>
    </div>
  )
}