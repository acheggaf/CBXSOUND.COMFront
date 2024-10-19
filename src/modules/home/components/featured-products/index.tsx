import { Region } from "@medusajs/medusa"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { FrontPagePlugins } from "types/global"
import styles from "./style.module.css"

export default function FeaturedProducts({
  plugins
}: {
  plugins: FrontPagePlugins[]
}) {
  return (
    <div className={styles.featuredProductsGrid}>
      {plugins.map((collection) => (
        <ProductRail key={collection.id} collection={collection} />
      ))}
    </div>
  )
}