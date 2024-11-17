import { Region } from "@medusajs/medusa"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { FrontPagePlugins } from "types/global"
import styles from "./style.module.css"

export default function FeaturedProducts({
  plugins
}: {
  plugins: FrontPagePlugins[]
}) {
  // Sort plugins by their position
  const sortedPlugins = [...plugins].sort((a, b) => a.pos - b.pos)

  return (
    <div className={styles.featuredProductsGrid}>
      {sortedPlugins.map((plugin) => (
        <ProductRail key={plugin.id} collection={plugin} />
      ))}
    </div>
  )
}