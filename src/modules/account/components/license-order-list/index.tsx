'use client'

import { Order } from "@medusajs/medusa"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./style.module.css"

export default function LicenseOrderList({ orders }: { orders: Order[] }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {orders.map((order) => (
        order.items.map((item) => (
          <div key={item.id} className={styles.licenseCard}>
            <div 
              className={styles.licenseHeader}
              onClick={() => toggleItem(item.id)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.licenseContent}>
                <div className={styles.imageContainer}>
                  <Image 
                    src={item.thumbnail || "/placeholder-image.png"}
                    alt={item.title}
                    width={160}
                    height={160}
                    sizes="80px"
                    quality={100}
                    priority
                    unoptimized
                    className={styles.productImage}
                  />
                </div>
                
                <div className={styles.detailsContainer}>
                  <h2 className={styles.productTitle}>{item.title}</h2>
                </div>

                <div className={styles.purchaseDate}>
                  <span>Purchase date: {order.created_at.toLocaleString()}</span>
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className={styles.chevron} />
                  ) : (
                    <ChevronDown className={styles.chevron} />
                  )}
                </div>
              </div>
            </div>

            {expandedItems.includes(item.id) && (
              <div className={styles.expandedContent}>
                <div className={styles.expandedSection}>
                  <h3 className={styles.sectionTitle}>Downloads</h3>
                  <button className={styles.downloadButton}>
                    Download Latest Version
                  </button>
                </div>

                <div className={styles.expandedSection}>
                  <h3 className={styles.sectionTitle}>Licenses</h3>
                  <div className={styles.licensesList}>
                    <p className={styles.noLicenses}>No licenses generated yet</p>
                    <button className={styles.generateButton}>
                      Generate New License
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ))}
    </div>
  )
}