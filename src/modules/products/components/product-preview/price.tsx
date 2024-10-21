import { Text, clx } from "@medusajs/ui"

import { PriceType } from "../product-actions"

export default async function PreviewPrice({ price }: { price: PriceType }) {
  return (
    <>
      {price.price_type === "sale" && (
        <Text className="line-through" data-testid="original-price">
          {price.original_price}
        </Text>
      )}
      <Text
        
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
