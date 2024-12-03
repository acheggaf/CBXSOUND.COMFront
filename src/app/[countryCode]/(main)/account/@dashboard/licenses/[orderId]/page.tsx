import { Metadata } from "next"
import { retrieveOrder, getLicensesByOrder } from "@lib/data"
import { notFound } from "next/navigation"
import LicenseDetails from "@modules/account/components/license-details"

export const metadata: Metadata = {
  title: "Order Licenses",
  description: "Manage licenses for your order.",
}

export default async function OrderLicenses({
  params: { orderId },
}: {
  params: { orderId: string }
}) {
  const [order, licensesData] = await Promise.all([
    retrieveOrder(orderId),
    getLicensesByOrder(orderId)
  ])

  if (!order || !licensesData) {
    notFound()
  }

  return (
    <div className="w-full">
      <LicenseDetails 
        order={order} 
        initialLicenses={licensesData.licenses} 
      />
    </div>
  )
}