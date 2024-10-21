import { Suspense } from "react"
import styles from "./style.module.css"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className={styles.contentcontainer} data-testid="category-container">

      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 className={styles.storepagetitle}>Plugins</h1>
        </div>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
          />
      </div>
    </div>
  )
}

export default StoreTemplate
