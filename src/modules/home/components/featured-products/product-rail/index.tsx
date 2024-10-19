import { Region } from "@medusajs/medusa"
import { FrontPagePlugins } from "types/global"
import styles from "./style.module.css"

export default function ProductRail({
  collection
}: {
  collection: FrontPagePlugins
}) {
  const { id, pos, title, description, image_url } = collection
  
  return (
    <a href={image_url} className={styles.productRail}>

      <div className={styles.productImageContainer}>
        <img
          src={image_url || '/placeholder-image.jpg'}
          alt={title}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productRailHeader}>
        <h3 className={styles.productTitle}>{title}</h3>
      </div>
      <div className={styles.description}>
        <p>{description}</p>
      </div>
    </a>
  )
}