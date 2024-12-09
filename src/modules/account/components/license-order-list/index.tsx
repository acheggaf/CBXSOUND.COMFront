'use client'

import { Order } from "@medusajs/medusa"
import { useState } from "react"
import { LicenseOrderItem } from "../license-order-item-prop"
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
          <LicenseOrderItem
            key={item.id}
            item={item}
            order={order}
            isExpanded={expandedItems.includes(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))
      ))}
    </div>
  )
}